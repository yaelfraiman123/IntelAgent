namespace IntelAgentWebApi.common
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Collections.Concurrent;
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
        private ConcurrentDictionary<string, List<stocks_action>> m_sell;
        private ConcurrentDictionary<string, List<stocks_action>> m_buy;
        private XmlStocksSerializer _xmlStockSerializer = XmlStocksSerializer.GetInstance();
        
        private StocksHandler()
        {
            XmlConfigurator.Configure();
            m_sell = new ConcurrentDictionary<string, List<stocks_action>>();
            m_buy = new ConcurrentDictionary<string, List<stocks_action>>();

            
        }

        public static StocksHandler GetInstance()
        {
            return _stockMatchManager;

        }

        public  void StartFindStocksMatches()
        {
            //Log.Error("start the thread of finding stock that match");
            //Entities context = new Entities();
            //var stockslst = context.stocks_action.ToList();
            //var sellLst = stockslst.Where(x => x.sell_action == 1);
            //var buyLst = stockslst.Where(x => x.sell_action == 0);
            //var grpSell = sellLst.GroupBy(x => x.stock_name);
            //var grpbuy = buyLst.GroupBy(x => x.stock_name);
            //foreach (var grp in grpSell)
            //{
            //    while(m_sell.TryAdd(grp.Key, grp.OrderByDescending(x=>x.date_time).ToList()))
            //    {
                    
            //    }
            //}
            //foreach (var grp in grpbuy)
            //{
            //    m_buy.TryAdd(grp.Key, grp.OrderByDescending(x => x.date_time).ToList());
            //}
            //Timer timer = new Timer(CheckStocksThread, null, 0, new TimeSpan(0, 0, 10, 0).Milliseconds);

        }

        private  void CheckStocksThread(Object stateInfo)
        {

            var marketStocksStatus = _xmlStockSerializer.XmlDarkPoolStockModel;
            foreach (var stockGroup in m_sell)
            {
                var marketStockStatus = marketStocksStatus.First(x => x.Symbol == stockGroup.Key);

                foreach (var sell in stockGroup.Value)
                {
                    double sellPrice;
                    bool isMarket = false;
                    double buyPrice = getBuyNumberMatch(marketStockStatus, sell, out sellPrice);
                    if (buyPrice >= marketStockStatus.BidQty && marketStockStatus.BidQty >= sellPrice)
                    {
                        isMarket = true;
                    }
                    if (m_buy.ContainsKey(stockGroup.Key))
                    {
                        var buyMatches = m_buy[stockGroup.Key].Where(x => x.user_id != sell.user_id 
                            && x.limit <= buyPrice && x.limit >= sellPrice 
                            && x.status==eStatus.InProgress.ToString()).ToList();
                        if (isMarket)
                        {
                            buyMatches.AddRange(m_buy[stockGroup.Key]
                                .Where(x => x.user_id != sell.user_id && x.market_limit == 1 
                                    && x.status==eStatus.InProgress.ToString())
                                .ToList());
                        }
                        buyMatches = buyMatches.OrderByDescending(x => x.date_time).ToList();
                        foreach (var buyMatch in buyMatches)
                        {
                            
                            double buyerPrice = buyMatch.market_limit==1?marketStockStatus.BidQty:(double)buyMatch.limit;
                            var average = (buyerPrice + sellPrice)/2;
                            createStockMatch(sell, buyMatch,average);
                            if (sell.status == eStatus.Done.ToString())
                            {
                                break;
                            }
                        }
                    }
                }
            }
            

        }

        private void createStockMatch(stocks_action sell, stocks_action buy, double i_Average)
        {
            if (buy.quantity >=sell.quantity)
            {
                buy.quantity -= sell.quantity;
                sell.quantity = 0;
                sell.status = eStatus.Done.ToString();
                if (buy.quantity==0)
                {
                    buy.status = eStatus.Done.ToString();
                }
                updatePrice(buy, sell.quantity,i_Average);
                updatePrice(sell, sell.quantity,i_Average);
            }
            else
            {
                sell.quantity -= buy.quantity;
                buy.quantity = 0;
                buy.status = eStatus.Done.ToString();
                updatePrice(buy, buy.quantity,i_Average);
                updatePrice(sell, buy.quantity,i_Average);
            }
            UpdateDb(sell);
            UpdateDb(buy);
        }

        private void updatePrice(stocks_action i_StockAction, int i_Quantity,double i_MatchPrice)
        {
            if (i_StockAction.amount_done !=null)
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
            double marketAverage = (i_MarketStockStatus.BidQty + i_MarketStockStatus.AskQty) / 2;
            if (i_Sell.market_limit == 1)
            {
                i_SellPrice = i_MarketStockStatus.AskQty;
                return i_MarketStockStatus.BidQty;
            }

            
            i_SellPrice = (double)i_Sell.limit;
            return ((marketAverage * 2) - i_SellPrice);
        }

        public  void Insert2Db(stocks_action stocksDataManager)
        {
            //add to db
            try
            {
                Entities context = new Entities();
                stocksDataManager.status = eStatus.InProgress.ToString();
                context.stocks_action.Add(stocksDataManager);
                context.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                 Log.ErrorFormat("Thier is error in insert new stock for user id :{0} the error {1}", stocksDataManager.user_id, ex.Message);

            }
             //add to dictionary
            if (stocksDataManager.sell_action==1)
            {
                if (m_sell.ContainsKey(stocksDataManager.stock_name))
                {
                    m_sell[stocksDataManager.stock_name].Add(stocksDataManager);
                }
                else
                {
                    m_sell.TryAdd(stocksDataManager.stock_name, new List<stocks_action>() { stocksDataManager });
                }
            }
            else
            {
                if (m_buy.ContainsKey(stocksDataManager.stock_name))
                {
                    m_buy[stocksDataManager.stock_name].Add(stocksDataManager);
                }
                else
                {
                    m_buy.TryAdd(stocksDataManager.stock_name, new List<stocks_action>() { stocksDataManager });
                }
            }
            Log.InfoFormat("insert new stock for user id : {0}", stocksDataManager.user_id);

        }

        public  List<stocks_action> GetStocksByUser(string userId)
        {
             Log.InfoFormat("retrive all stock for user {0}", userId);
            Entities context = new Entities();

            var stockslst = context.stocks_action.ToList();
            return stockslst.Where(x => x.user_id == userId).ToList();
        }

        public void UpdateDb(stocks_action stock)
        {
            Entities context = new Entities();
            var stockToUpdate = context.stocks_action.First(x => x.id ==stock.id);
            if (stockToUpdate!=null)
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
                context.SaveChanges();
            }
            else
            {
                throw new Exception("the stock not found in the db");
            }
           
        }

        public void DeleteFromDb(string id)
        {
            try
            {
                Entities context = new Entities();
                var stockToDelete = context.stocks_action.First(x => x.id == id);
                stockToDelete.status = eStatus.Deleted.ToString();
                context.SaveChanges();
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            
        }
    }
}