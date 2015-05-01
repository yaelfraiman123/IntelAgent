using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using IntelAgentWebApi.DAL;

namespace IntelAgentWebApi.Models
{
    public class DarkPoolStockManagerModel
    {
        public void Insert2Db(StocksDataManager stocksDataManager)
        {
            Entities context = new Entities();
            context.StocksDataManagers.Add(stocksDataManager);
            context.SaveChanges();
        }

        public List<StocksDataManager> GetStocksByUser(string userId)
        {
            Entities context = new Entities();

            var stockslst = context.StocksDataManagers.ToList();
            return stockslst.Where(x => x.user_id == userId).ToList();
        }

        
    }
}