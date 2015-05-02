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

namespace IntelAgentWebApi.Models
{
     public class DarkPoolStockRepository
    {

         private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        /// <summary>
        /// Retrieves the list of DarkPoolStock.
        /// </summary>
        /// <returns></returns>
        internal List<DarkPoolStockModel> Retrieve()
        {
            Log.Info("get all the stocks from xml");
            var filePath = HostingEnvironment.MapPath(@"~/App_Data/DarkPoolStockMarket.xml");
            XmlDocument doc = new XmlDocument();
            doc.Load(filePath);
            string jsonText = JsonConvert.SerializeXmlNode(doc);

            var first = jsonText.IndexOf("[{\"Symbol");
            var end = jsonText.IndexOf("}}");
            var subString = jsonText.Substring(first, end - first);
            var stockslst = JsonConvert.DeserializeObject<List<DarkPoolStockModel>>(subString);

            return stockslst;

        }

   

    }
}