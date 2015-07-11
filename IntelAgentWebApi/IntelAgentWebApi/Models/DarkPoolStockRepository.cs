using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Xml;
using Newtonsoft.Json;
using Formatting = Newtonsoft.Json.Formatting;
using log4net;
using System.Reflection;
using IntelAgentWebApi.common;

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
            return XmlStocksSerializer.GetInstance().XmlDarkPoolStockModel;
        }

   

    }
}