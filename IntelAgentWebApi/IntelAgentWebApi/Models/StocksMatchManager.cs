using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Hosting;
using IntelAgentWebApi.DAL;
using Microsoft.Owin.Logging;
using log4net;
using log4net.Config;
using System.Reflection;

namespace IntelAgentWebApi.Models
{
     
      
    public static class StocksMatchManager
    {
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private static Dictionary<string, List<StocksDataManager>> m_sell;
        private static Dictionary<string, List<StocksDataManager>> m_buy;
        static StocksMatchManager()
        {
            XmlConfigurator.Configure();
            m_sell=new Dictionary<string, List<StocksDataManager>>();
            m_buy=new Dictionary<string, List<StocksDataManager>>();
            
        }

        //public static void StartFindStocksMatches()
        //{
        //    Log.Error("start the thread of finding stock that match");
        //    Entities context = new Entities();
        //    var stockslst = context.StocksDataManagers.ToList();
        //    var sellLst = stockslst.Where(x => x.sell_action == 1);
        //    var buyLst = stockslst.Where(x => x.sell_action == 0);
        //    var grpSell = sellLst.GroupBy(x => x.stock_name);
        //    var grpbuy = buyLst.GroupBy(x => x.stock_name);
        //    foreach (var grp in grpSell)
        //    {
        //        m_sell.Add(grp.Key, grp.ToList());
        //        m_sell[grp.Key].OrderBy(x => x.date_time);
        //    }
        //    foreach (var grp in grpbuy)
        //    {
        //        m_buy.Add(grp.Key, grp.ToList());
        //        m_buy[grp.Key].OrderBy(x => x.date_time);
        //    }
        //    Timer timer= new Timer(new TimerCallback(CheckStockThread), null, 0, new TimeSpan(0,0,10,0).Milliseconds);

        //}

        private static void CheckStockThread(Object stateInfo)
        {
            //string path = HostingEnvironment.MapPath(@"~/App_Data/MyTest.txt");
            //string[] lines = { DateTime.Now.ToString("F") };
            //File.AppendAllLines(path, lines);
             foreach (var stock in m_sell)
             {
                  if (m_buy.ContainsKey(stock.Key))
                  {
                       foreach (var stockItem in stock.Value)
                       {

                       }
                  }
             }


        }

        public static void Insert2Db(StocksDataManager stocksDataManager)
        {
            //add to db
            try
            {

                Entities context = new Entities();
                context.StocksDataManagers.Add(stocksDataManager);
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
                    m_sell.Add(stocksDataManager.stock_name,new List<StocksDataManager>(){stocksDataManager});
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
                    m_buy.Add(stocksDataManager.stock_name, new List<StocksDataManager>() { stocksDataManager });
                }
            }
            Log.InfoFormat("insert new stock for user id : {0}", stocksDataManager.user_id);

        }

        public static List<StocksDataManager> GetStocksByUser(string userId)
        {
             Log.InfoFormat("retrive all stock for user {0}", userId);
            Entities context = new Entities();

            var stockslst = context.StocksDataManagers.ToList();
            return stockslst.Where(x => x.user_id == userId).ToList();
        }

         public static void updateStock(StocksDataManager stock)
        {
             Entities context = new Entities();
             var stockToUpdate = context.StocksDataManagers.Find(stock.Id);

        }

    }
}