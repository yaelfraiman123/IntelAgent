namespace IntelAgentWebApi.common
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Collections.Concurrent;
    using System.Text;
    using System.Threading;
    using IntelAgentWebApi.DAL;
    using IntelAgentWebApi.Models;
    using log4net;
    using log4net.Config;

    public enum eStatus
     {
         InProgress,
         Deleted,
         Done
     }
      
    public  class StocksHandler
    {
        private static readonly StocksHandler _stockMatchManager = new StocksHandler();
        private  readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private ConcurrentDictionary<string, List<stocks_action>> _sell;
        private ConcurrentDictionary<string, List<stocks_action>> _buy;
        private XmlStocksSerializer _xmlStockSerializer = XmlStocksSerializer.GetInstance(); 
        private EventWaitHandle _WaitEvent = new EventWaitHandle(false,EventResetMode.AutoReset);


        
        private StocksHandler()
        {
            XmlConfigurator.Configure();
            _sell = new ConcurrentDictionary<string, List<stocks_action>>();
            _buy = new ConcurrentDictionary<string, List<stocks_action>>();
        }

        public static StocksHandler GetInstance()
        {
            return _stockMatchManager;

        }

        public  void StartFindStocksMatches()
        {
            Log.Error("start the thread of finding stock that match");
            Entities _context = new Entities();

            var stockslst = _context.stocks_action.Where(x=>x.status !=eStatus.Done.ToString() && x.status!=eStatus.Deleted.ToString()).ToList();
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
            Timer timer = new Timer(checkStocksThread, null, 0, 10000*6);
            


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

            var marketStocksStatus = _xmlStockSerializer.XmlDarkPoolStockModel;
            foreach (var stockGroup in _sell)
            {
                var marketStockStatus = marketStocksStatus.FirstOrDefault(x => x.Symbol == stockGroup.Key);
                if (marketStockStatus ==null)
                {
                    continue;
                }

                foreach (var sell in stockGroup.Value)
                {
                    double sellPrice;
                    bool isMarket = false;
                    double buyPrice = getBuyNumberMatch(marketStockStatus, sell, out sellPrice);
                    if (buyPrice >= marketStockStatus.Bid && marketStockStatus.Bid >= sellPrice)
                    {
                        isMarket = true;
                    }
                    if (_buy.ContainsKey(stockGroup.Key))
                    {
                        var buyMatches = _buy[stockGroup.Key].Where(x => x.user_id != sell.user_id 
                            && x.limit <= buyPrice && x.limit >= sellPrice 
                            && x.status==eStatus.InProgress.ToString()).ToList();
                        if (isMarket)
                        {
                            buyMatches.AddRange(_buy[stockGroup.Key]
                                .Where(x => x.user_id != sell.user_id && x.market_limit ==1
                                    && x.status==eStatus.InProgress.ToString())
                                .ToList());
                        }
                        buyMatches = buyMatches.OrderBy(x => x.date_time).ToList();
                        foreach (var buyMatch in buyMatches)
                        {

                            float buyerPrice = buyMatch.market_limit == 1 ? (float)(marketStockStatus.Bid) : (float)buyMatch.limit;
                            float average = (float)(buyerPrice + sellPrice)/2;
                            createStockMatch(sell, buyMatch,average);
                            if (sell.status == eStatus.Done.ToString())
                            {
                                break;
                            }
                        }
                    }
                }
                _sell[stockGroup.Key].RemoveAll(x => x.status == eStatus.Deleted.ToString() || x.status == eStatus.Done.ToString());
                if (_buy.ContainsKey(stockGroup.Key))
                {
                    _buy[stockGroup.Key].RemoveAll(x => x.status == eStatus.Deleted.ToString() || x.status == eStatus.Done.ToString());                    
                }
            }
            

        }

     

        private void createStockMatch(stocks_action sell, stocks_action buy, float i_Average)
        {
            if (buy.quantity >=sell.quantity)
            {
                updatePrice(buy, sell.quantity, i_Average);
                updatePrice(sell, sell.quantity, i_Average);
                buy.quantity -= sell.quantity;
                sell.quantity = 0;
                sell.status = eStatus.Done.ToString();
                if (buy.quantity==0)
                {
                    buy.status = eStatus.Done.ToString();
                }
                
            }
            else
            {
                updatePrice(buy, buy.quantity, i_Average);
                updatePrice(sell, buy.quantity, i_Average);
                sell.quantity -= buy.quantity;
                buy.quantity = 0;
                buy.status = eStatus.Done.ToString();
                
            }
            UpdateDb(sell);
            UpdateDb(buy);
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

        private double getBuyNumberMatch(DarkPoolStockModel i_MarketStockStatus, stocks_action i_Sell, out double i_SellPrice)
        {
            double marketAverage = (i_MarketStockStatus.Bid + i_MarketStockStatus.Ask) / 2;
            if (i_Sell.market_limit==1)
            {
                i_SellPrice = i_MarketStockStatus.Ask;
                return i_MarketStockStatus.Bid;
            }

            
            i_SellPrice = (double)i_Sell.limit;
            return ((marketAverage * 2) - i_SellPrice);
        }

       

        public  void Insert2Db(stocks_action stocksDataManager)
        {
            //add to db
            try
            {
                Entities _context = new Entities();
                stocksDataManager.status = eStatus.InProgress.ToString();
                _context.stocks_action.Add(stocksDataManager);
                _context.SaveChanges();
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
             Entities _context = new Entities();

            var stockslst = _context.stocks_action.ToList();
            return stockslst.Where(x => x.user_id == userId).ToList();
        }

        public void UpdateDb(stocks_action stock)
        {
            Entities _context = new Entities();

            var stockToUpdate = _context.stocks_action.First(x => x.Id ==stock.Id);
            if (stockToUpdate!=null)
            {
                UpdateStock(stock, stockToUpdate);
                _context.SaveChanges();
                updateDictionary(stockToUpdate);
            }
            else
            {
                throw new Exception("the stock not found in the db");
            }
           
        }

        private static void UpdateStock(stocks_action stock, stocks_action stockToUpdate)
        {
            stockToUpdate.stock_name = stock.stock_name;
            stockToUpdate.limit = stock.limit;
            stockToUpdate.market_limit = stock.market_limit;
            stockToUpdate.price_done = stock.price_done;
            stockToUpdate.amount_done = stock.amount_done;
            stockToUpdate.quantity = stock.quantity;
            stockToUpdate.sell_action = stock.sell_action;
            stockToUpdate.status = stock.status;
            stockToUpdate.strategy = stock.strategy;
            stockToUpdate.target = stock.target;
        }

        private void updateDictionary(stocks_action i_Stcok)
        {
            stocks_action stockTpUpdate = null;
            if (i_Stcok.sell_action == 1)
            {
                if (_sell.ContainsKey(i_Stcok.stock_name))
                {
                    stockTpUpdate = _sell[i_Stcok.stock_name].First(x => x.Id == i_Stcok.Id);
                }
            }
            else
            {
                if (_buy.ContainsKey(i_Stcok.stock_name))
                {
                    stockTpUpdate = _buy[i_Stcok.stock_name].First(x => x.Id == i_Stcok.Id);
                }
            }
            UpdateStock(i_Stcok, stockTpUpdate);

        }

        public void DeleteFromDb(string id)
        {
            try
            {
                Entities _context = new Entities();

                var stockToDelete = _context.stocks_action.First(x => x.Id == id);
                stockToDelete.status = eStatus.Deleted.ToString();
                _context.SaveChanges();
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
                    var stock = _sell[i_StockToDelete.stock_name].First(x => x.Id == i_StockToDelete.Id);
                    stock.status = eStatus.Deleted.ToString();
                }
            }
            else
            {
                if (_buy.ContainsKey(i_StockToDelete.stock_name))
                {
                    var stock = _buy[i_StockToDelete.stock_name].First(x => x.Id == i_StockToDelete.Id);
                    stock.status = eStatus.Deleted.ToString();
                }
            }
        }
    }
}