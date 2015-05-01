using System;
using System.Collections.Generic;
using System.Linq;
using IntelAgentWebApi.Models;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(IntelAgentWebApi.Startup))]

namespace IntelAgentWebApi
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            StocksMatchManager.StartFindStocksMatches();
        }
    }
}
