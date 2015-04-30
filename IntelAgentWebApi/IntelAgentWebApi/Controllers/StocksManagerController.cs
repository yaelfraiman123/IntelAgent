using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Security;
using IntelAgentWebApi.DAL;
using IntelAgentWebApi.Models;
using Microsoft.AspNet.Identity;

namespace IntelAgentWebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [Authorize]
    public class StocksManagerController : ApiController
    {
       

        // GET: api/StocksManager/5
        public List<StocksDataManager> Get()
        {

            
            return StocksMatchManager.GetStocksByUser(User.Identity.GetUserId());

        }

        // POST: api/StocksManager
        public void Post([FromBody]StocksDataManager value)
        {
          //  StocksMatchManager stocksDataManager = new StocksMatchManager();
            value.user_id = User.Identity.GetUserId();
            StocksMatchManager.Insert2Db(value);
        }

     
    }
}
