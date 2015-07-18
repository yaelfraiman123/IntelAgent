namespace IntelAgentWebApi.common
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Collections.Concurrent;
    using System.ComponentModel;
    using System.Text;
    using System.Threading;
    using IntelAgentWebApi.DAL;
    using IntelAgentWebApi.Models;
    using log4net;
    using log4net.Config;

    
      
    public  class StocksHandler
    {
        private static readonly StocksHandler _stockMatchManager = new StocksHandler();
        private  readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private ConcurrentDictionary<string, List<stocks_action>> _sell;
        private ConcurrentDictionary<string, List<stocks_action>> _buy;
        private XmlStocksSerializer _xmlStockSerializer = XmlStocksSerializer.GetInstance(); 
        private EventWaitHandle _WaitEvent = new EventWaitHandle(false,EventResetMode.AutoReset);
        private const int _intervalTime = 1000 * 60;
        private System.Threading.Timer _timer;
        private DBHandler _dbHandler =DBHandler.GetInstance();
        public Dictionary<string, bool> IsUserStocksChanged { get; set; }

        
        private StocksHandler()
        {
            XmlConfigurator.Configure();
            _sell = new ConcurrentDictionary<string, List<stocks_action>>();
            _buy = new ConcurrentDictionary<string, List<stocks_action>>();
            IsUserStocksChanged = new Dictionary<string, bool>();
        }

        public static StocksHandler GetInstance()
        {
            return _stockMatchManager;

        }

        public  void StartFindStocksMatches()
        {
            Log.Error("start the thread of finding stock that match");
            Entities _context = new Entities();

            var stockslst = _context.stocks_action.AsEnumerable()
                .Where(x => x.status != StockStatusGetter.GetDescription(eStatus.Done) 
                    && x.status != StockStatusGetter.GetDescription(eStatus.Deleted)).ToList();
            var sellLst = stockslst.Where(x => x.sell_action==1);
            var buyLst = stockslst.Where(x => x.sell_action==0);
            var grpSell = sellLst.GroupBy(x => x.stock_name);
            var grpbuy = buyLst.GroupBy(x => x.stock_name);
            foreach (var grp in grpSell)
            {
                addToDictionary(_sell,grp.Key, grp.OrderBy(x => x.date_time).ToList());
            }
            foreach (var grp in grpbuy)
            {
                addToDictionary(_buy, grp.Key, grp.OrderBy(x => x.date_time).ToList());
            }
            _timer = new System.Threading.Timer(new TimerCallback(checkStocksThread), null, 0, _intervalTime);
            


        }
        private void UpdateActionLog(stocks_action i_Sell, stocks_action i_Buy, int i_Quantity, float i_Average)
        {
            _dbHandler.UpdateActionLog(i_Sell,i_Buy,i_Quantity, i_Average);
      
        }

        private void addToDictionary(ConcurrentDictionary<string, List<stocks_action>> dic,string key, List<stocks_action> stocksToAdd)
        {
            while (dic.TryAdd(key,stocksToAdd))
            {
                _WaitEvent.WaitOne(new TimeSpan(0, 0, 5).Milliseconds);
            }
        }

        private  void checkStocksThread(Object stateInfo)
        {
            try
            {

                var marketStocksStatus = _xmlStockSerializer.XmlDarkPoolStockModel;
                foreach (var stockGroup in _sell)
                {
                    var marketStockStatus = marketStocksStatus.FirstOrDefault(x => x.Symbol == stockGroup.Key);
                    if (marketStockStatus ==null)
                    {
                        continue;
                    }
                    float marketAverage = (marketStockStatus.Bid + marketStockStatus.Ask) / 2;
                    foreach (var sell in stockGroup.Value)
                    {
                        float sellPrice;
                        double buyPrice = getBuyNumberMatch(marketStockStatus, sell,marketAverage, out sellPrice);
                        if (_buy.ContainsKey(stockGroup.Key))
                        {
                            var buyMatches = _buy[stockGroup.Key].Where(x => x.user_id != sell.user_id 
                                && x.limit <= buyPrice && x.limit >= sellPrice
                                && x.status == StockStatusGetter.GetDescription(eStatus.InProgress)).ToList();
                            if (sellPrice <= marketAverage)
                            {
                                buyMatches.AddRange(_buy[stockGroup.Key]
                                    .Where(x => x.user_id != sell.user_id && x.market_limit ==1
                                        && x.status == StockStatusGetter.GetDescription(eStatus.InProgress))
                                    .ToList());
                            }
                            buyMatches = buyMatches.OrderBy(x => x.date_time).ToList();
                            foreach (var buyMatch in buyMatches)
                            {
                                float average = GetAvragePrice(sellPrice, buyMatch, marketAverage, marketStockStatus);
                                createStockMatch(sell, buyMatch,average);
                                if (sell.status == StockStatusGetter.GetDescription(eStatus.Done))
                                {
                                    break;
                                }
                            }
                        }
                    }
                    _sell[stockGroup.Key].RemoveAll(x => x.status == StockStatusGetter.GetDescription(eStatus.Deleted) || x.status == StockStatusGetter.GetDescription(eStatus.Done));
                    if (_buy.ContainsKey(stockGroup.Key))
                    {
                        _buy[stockGroup.Key].RemoveAll(x => x.status == StockStatusGetter.GetDescription(eStatus.Deleted) || x.status == StockStatusGetter.GetDescription(eStatus.Done));                    
                    }
                }
            }
            catch (Exception ex)
            {

                Log.ErrorFormat("Error : {0}", ex.Message);
            }
            

        }

        private float GetAvragePrice(float i_SellPrice, stocks_action i_BuyMatch, float i_MarketAverage, DarkPoolStockModel i_MarketStockStatus)
        {
            if (i_BuyMatch.market_limit == 1)
            {
                if (i_SellPrice<=i_MarketStockStatus.Ask)
                {
                    return (i_SellPrice + i_MarketStockStatus.Bid) / 2;
                }
                else
                {
                    return i_MarketAverage;
                }
            }
            else
            {
                return (i_SellPrice + (float)i_BuyMatch.limit) / 2;
            }
        }

        private void createStockMatch(stocks_action sell, stocks_action buy, float i_Average)
        {

            if (buy.quantity >=sell.quantity)
            {
                UpdateActionLog(sell, buy, sell.quantity, i_Average);
                updatePrice(buy, sell.quantity, i_Average);
                updatePrice(sell, sell.quantity, i_Average);
                buy.quantity -= sell.quantity;
                sell.quantity = 0;
                sell.status = StockStatusGetter.GetDescription(eStatus.Done);
                sell.is_updatable = 0;
                if (buy.quantity==0)
                {
                    buy.status = StockStatusGetter.GetDescription(eStatus.Done);
                    buy.is_updatable = 0;
                }
                
            }
            else
            {
                UpdateActionLog(sell, buy, buy.quantity, i_Average);
                updatePrice(buy, buy.quantity, i_Average);
                updatePrice(sell, buy.quantity, i_Average);
                sell.quantity -= buy.quantity;
                buy.quantity = 0;
                buy.status = StockStatusGetter.GetDescription(eStatus.Done);
                buy.is_updatable = 0;
                
            }
            UpdateStockAction(sell);
            UpdateStockAction(buy);
        }

        private void updatePrice(stocks_action i_StockAction, int i_Quantity,float i_MatchPrice)
        {
            if (i_StockAction.amount_done !=null && i_StockAction.amount_done>0)
            {
                i_StockAction.price_done = ((i_StockAction.amount_done * i_StockAction.price_done)
                    + (i_Quantity * i_MatchPrice)) 
                    / (i_StockAction.amount_done + i_Quantity);
                i_StockAction.amount_done = i_StockAction.amount_done + i_Quantity;
            }
            else
            {
                i_StockAction.amount_done = i_Quantity;
                i_StockAction.price_done = i_MatchPrice;
            }
        }

        private double getBuyNumberMatch(DarkPoolStockModel i_MarketStockStatus, stocks_action i_Sell, double i_MarketAverage, out float i_SellPrice)
        {
            if (i_Sell.market_limit==1)
            {
                i_SellPrice = i_MarketStockStatus.Ask;
                return i_MarketStockStatus.Bid;
            }

            
            i_SellPrice = (float)i_Sell.limit;
            return ((i_MarketAverage * 2) - i_SellPrice);
        }

        public  void AddNewStcokAction(stocks_action stocksDataManager)
        {
            //add to db
            try
            {
                _dbHandler.AddNewStockAction(stocksDataManager);
                
            }
            catch (Exception ex)
            {

                 Log.ErrorFormat("Thier is error in insert new stock for user id :{0} the error {1}", stocksDataManager.user_id, ex.Message);

            }
             //add to dictionary
            if (stocksDataManager.sell_action == 1)
            {
                if (_sell.ContainsKey(stocksDataManager.stock_name))
                {
                    _sell[stocksDataManager.stock_name].Add(stocksDataManager);
                }
                else
                {
                    addToDictionary(_sell, stocksDataManager.stock_name, new List<stocks_action>() { stocksDataManager });
                }
            }
            else
            {
                if (_buy.ContainsKey(stocksDataManager.stock_name))
                {
                    _buy[stocksDataManager.stock_name].Add(stocksDataManager);
                }
                else
                {
                    addToDictionary(_buy, stocksDataManager.stock_name, new List<stocks_action>() { stocksDataManager });
                }
            }
            Log.InfoFormat("insert new stock for user id : {0}", stocksDataManager.user_id);

        }

        public  List<stocks_action> GetStocksByUser(string userId)
        {
            Log.InfoFormat("retrive all stock for user {0}", userId);
            return _dbHandler.GetStocksByUserId(userId);
           
        }

        public void UpdateStockAction(stocks_action stock)
        {
            if (IsUserStocksChanged.ContainsKey(stock.user_id))
            {
                IsUserStocksChanged[stock.user_id] = true;
            }
            else
            {
                IsUserStocksChanged.Add(stock.user_id, true);
            }
            stocks_action stockToUpdate = _dbHandler.UpdateActionStock(stock);
            updateDictionary(stockToUpdate);
        }

        private stocks_action UpdateStock(stocks_action stock, stocks_action stockToUpdate)
        {
            stock.Id = stockToUpdate.Id;
            stock.date_time = stockToUpdate.date_time;
            stock.user_id = stockToUpdate.user_id;
            stockToUpdate = stock;
            return stockToUpdate;
        }

        private void updateDictionary(stocks_action i_Stcok)
        {
            stocks_action stockTpUpdate = null;
            if (i_Stcok.sell_action == 1)
            {
                if (_sell.ContainsKey(i_Stcok.stock_name))
                {
                    stockTpUpdate = _sell[i_Stcok.stock_name].FirstOrDefault(x => x.Id == i_Stcok.Id);
                }
            }
            else
            {
                if (_buy.ContainsKey(i_Stcok.stock_name))
                {
                    stockTpUpdate = _buy[i_Stcok.stock_name].FirstOrDefault(x => x.Id == i_Stcok.Id);
                }
            }
            UpdateStock(i_Stcok, stockTpUpdate);

        }

        public void DeleteStockAction(string id)
        {
            try
            {
                var stockToDelete = _dbHandler.DeleteStockAction(id);
                deleteStockFromDictionray(stockToDelete);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            
        }

        private void deleteStockFromDictionray(stocks_action i_StockToDelete)
        {
            if (i_StockToDelete.sell_action == 1)
            {
                if (_sell.ContainsKey(i_StockToDelete.stock_name))
                {
                    var stock = _sell[i_StockToDelete.stock_name].FirstOrDefault(x => x.Id == i_StockToDelete.Id);
                    stock.status = StockStatusGetter.GetDescription(eStatus.Deleted);
                }
            }
            else
            {
                if (_buy.ContainsKey(i_StockToDelete.stock_name))
                {
                    var stock = _buy[i_StockToDelete.stock_name].FirstOrDefault(x => x.Id == i_StockToDelete.Id);
                    stock.status = StockStatusGetter.GetDescription(eStatus.Deleted);
                }
            }
        }
    }
}