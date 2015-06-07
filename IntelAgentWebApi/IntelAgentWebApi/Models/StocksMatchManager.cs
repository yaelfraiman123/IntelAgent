using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Hosting;

using Microsoft.Owin.Logging;
using log4net;
using log4net.Config;
using System.Reflection;
using IntelAgentWebApi.DAL;

namespace IntelAgentWebApi.Models
{
     
      
    public  class StocksMatchManager
    {
        private  readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private  Dictionary<string, List<StockDataManager>> m_sell;
        private  Dictionary<string, List<StockDataManager>> m_buy;
        public StocksMatchManager()
        {
            XmlConfigurator.Configure();
            m_sell = new Dictionary<string, List<StockDataManager>>();
            m_buy = new Dictionary<string, List<StockDataManager>>();
            
        }

        public  void StartFindStocksMatches()
        {
            // crushing(Shahar)

            //Log.Error("start the thread of finding stock that match");
            //Entities context = new Entities();
            //var stockslst = context.StockDataManagers.ToList();
            //var sellLst = stockslst.Where(x => x.sell_action == 1);
            //var buyLst = stockslst.Where(x => x.sell_action == 0);
            //var grpSell = sellLst.GroupBy(x => x.stock_name);
            //var grpbuy = buyLst.GroupBy(x => x.stock_name);
            //foreach (var grp in grpSell)
            //{
            //    m_sell.Add(grp.Key, grp.ToList());
            //    m_sell[grp.Key].OrderBy(x => x.date_time);
            //}
            //foreach (var grp in grpbuy)
            //{
            //    m_buy.Add(grp.Key, grp.ToList());
            //    m_buy[grp.Key].OrderBy(x => x.date_time);
            //}
            //Timer timer = new Timer(new TimerCallback(CheckStockThread), null, 0, new TimeSpan(0, 0, 10, 0).Milliseconds);

        }

        private  void CheckStockThread(Object stateInfo)
        {
            
             //foreach (var stock in m_sell)
             //{
             //     if (m_buy.ContainsKey(stock.Key))
             //     {
             //          foreach (var stockItem in stock.Value)
             //          {

             //          }
             //     }
             //}


        }

        public  void Insert2Db(StockDataManager stocksDataManager)
        {
            //add to db
            try
            {

                Entities context = new Entities();
                context.StockDataManagers.Add(stocksDataManager);
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
                    m_sell.Add(stocksDataManager.stock_name, new List<StockDataManager>() { stocksDataManager });
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
                    m_buy.Add(stocksDataManager.stock_name, new List<StockDataManager>() { stocksDataManager });
                }
            }
            Log.InfoFormat("insert new stock for user id : {0}", stocksDataManager.user_id);

        }

        public  List<StockDataManager> GetStocksByUser(string userId)
        {
             Log.InfoFormat("retrive all stock for user {0}", userId);
            Entities context = new Entities();

            var stockslst = context.StockDataManagers.ToList();
            return stockslst.Where(x => x.user_id == userId).ToList();
        }

        public  void updateStock(StockDataManager stock)
        {
             Entities context = new Entities();
             var stockToUpdate = context.StockDataManagers.Find(stock.Id);

        }

    }
}