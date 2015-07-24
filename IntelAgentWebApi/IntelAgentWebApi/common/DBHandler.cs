using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IntelAgentWebApi.common
{
    using IntelAgentWebApi.DAL;

    public class DBHandler
    {
        private static DBHandler  _instance = new DBHandler();
        private DBHandler()
        {
            
        }

        public static DBHandler GetInstance()
        {
            return _instance;
        }

        public void UpdateActionLog(stocks_action i_Sell, stocks_action i_Buy, int i_Quantity, float i_Average)
        {
            using (Entities _context = new Entities())
            {
                _context.action_log.Add(new action_log()
                {
                    sell_user_id = i_Sell.user_id,
                    buy_user_id = i_Buy.user_id,
                    quantity_ = i_Quantity,
                    price_ = i_Average,
                    stock_name_ = i_Sell.stock_name,
                    date_time = DateTime.Now,
                    Id = Guid.NewGuid().ToString()
                });
                _context.SaveChanges();
                
            }
            
        }

        public void AddNewStockAction(stocks_action i_StocksDataManager)
        {
            using (Entities _context = new Entities())
            {
                i_StocksDataManager.status = StockStatusGetter.GetDescription(eStatus.InProgress);
                _context.stocks_action.Add(i_StocksDataManager);
                _context.SaveChanges();
            }
        }

        public List<stocks_action> GetStocksByUserId(string i_UserId)
        {
            using (Entities _context = new Entities())
            {
                var stockslst = _context.stocks_action.ToList();
                return stockslst.Where(x => x.user_id == i_UserId).ToList();
            }
        }

        public stocks_action UpdateActionStock(stocks_action i_Stock)
        {
            using (Entities _context = new Entities())
            {
                var stockToUpdate = _context.stocks_action.FirstOrDefault(x => x.Id == i_Stock.Id);
                if (stockToUpdate != null)
                {
                    i_Stock.Id = stockToUpdate.Id;
                    i_Stock.date_time = stockToUpdate.date_time;
                    i_Stock.user_id = stockToUpdate.user_id;
                    stockToUpdate = i_Stock;
                    _context.SaveChanges();
                }
                else
                {
                    throw new Exception("the stock not found in the db");
                }
                return stockToUpdate;
            }
        }

        public stocks_action DeleteStockAction(string i_Id)
        {
            using (Entities _context = new Entities())
            {
                var stockToDelete = _context.stocks_action.FirstOrDefault(x => x.Id == i_Id);
                if (stockToDelete == null)
                {
                    throw new Exception("Stock Action not found");
                }
                stockToDelete.status = StockStatusGetter.GetDescription(eStatus.Deleted);
                stockToDelete.is_updatable = 0;
                _context.SaveChanges();
                return stockToDelete;
            }
        }
    }
}