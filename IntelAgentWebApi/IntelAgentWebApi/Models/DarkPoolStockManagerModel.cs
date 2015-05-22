using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using IntelAgentWebApi.DAL;

namespace IntelAgentWebApi.Models
{
    public class DarkPoolStockManagerModel
    {
        public void Insert2Db(StockDataManager stocksDataManager)
        {
            Entities context = new Entities();
            context.StockDataManagers.Add(stocksDataManager);
            context.SaveChanges();
        }

        public List<StockDataManager> GetStocksByUser(string userId)
        {
            Entities context = new Entities();

            var stockslst = context.StockDataManagers.ToList();
            return stockslst.Where(x => x.user_id == userId).ToList();
        }

        
    }
}