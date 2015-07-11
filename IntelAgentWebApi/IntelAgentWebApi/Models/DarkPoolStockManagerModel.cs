using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using IntelAgentWebApi.DAL;

namespace IntelAgentWebApi.Models
{
    public class DarkPoolStockManagerModel
    {
        public void Insert2Db(stocks_action stocksDataManager)
        {
            Entities context = new Entities();
            context.stocks_action.Add(stocksDataManager);
            context.SaveChanges();
        }

        public List<stocks_action> GetStocksByUser(string userId)
        {
            Entities context = new Entities();

            var stockslst = context.stocks_action.ToList();
            return stockslst.Where(x => x.user_id == userId).ToList();
        }

        
    }
}