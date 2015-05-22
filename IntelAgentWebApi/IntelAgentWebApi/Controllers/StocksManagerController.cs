using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Security;
using IntelAgentWebApi.common;
using IntelAgentWebApi.DAL;
using IntelAgentWebApi.Models;
using Microsoft.AspNet.Identity;

namespace IntelAgentWebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [Authorize]
    public class StocksManagerController : ApiController
    {
        private readonly StocksMatchManager _stocksMatchManager = objectFactory.getStockMatchManager();

        // GET: api/StocksManager/5
        public List<StockDataManager> Get()
        {


            return _stocksMatchManager.GetStocksByUser(User.Identity.GetUserId());

        }

        // POST: api/StocksManager
        public void Post([FromBody]StockDataManager value)
        {
         
            value.user_id = User.Identity.GetUserId();
            value.date_time = DateTime.Now;
            _stocksMatchManager.Insert2Db(value);
        }

     
    }
}
