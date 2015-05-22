using IntelAgentWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IntelAgentWebApi.common
{



    public class objectFactory
    {
        private static readonly StocksMatchManager _stockMatchManager=new StocksMatchManager();
        public static StocksMatchManager getStockMatchManager()
        {
            return _stockMatchManager;
        }

    }
}