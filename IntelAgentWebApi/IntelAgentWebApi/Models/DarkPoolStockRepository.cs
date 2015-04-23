using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Xml;
using Newtonsoft.Json;
using Formatting = Newtonsoft.Json.Formatting;

namespace IntelAgentWebApi.Models
{
    public class DarkPoolStockRepository
    {
        

        /// <summary>
        /// Retrieves the list of DarkPoolStock.
        /// </summary>
        /// <returns></returns>
        internal List<DarkPoolStockModel> Retrieve()
        {
            var filePath = HostingEnvironment.MapPath(@"~/App_Data/DarkPoolStockMarket.json");

            var json = System.IO.File.ReadAllText(filePath);

            var stockslst = JsonConvert.DeserializeObject<List<DarkPoolStockModel>>(json);

            return stockslst;
        }

   

    }
}