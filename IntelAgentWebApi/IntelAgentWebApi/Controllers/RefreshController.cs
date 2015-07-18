using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace IntelAgentWebApi.Controllers
{
    using System.Web.Http.Cors;

    using IntelAgentWebApi.common;

    using Microsoft.AspNet.Identity;
    [EnableCors("*", "*", "*")]
    [Authorize]
    public class RefreshController : ApiController
    {
        private readonly StocksHandler _stocksMatchManager = StocksHandler.GetInstance();

        // GET: api/Refresh
        public bool Get()
        {
            var userId = User.Identity.GetUserId();
            if (_stocksMatchManager.IsUserStocksChanged.ContainsKey(userId))
            {
                if (_stocksMatchManager.IsUserStocksChanged[userId])
                {
                    _stocksMatchManager.IsUserStocksChanged[userId] = false;
                    return true;
                }
            }
            return false;
        }

       
    }
}
