using IntelAgentWebApi.Models;
using log4net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Hosting;
using System.Xml;

namespace IntelAgentWebApi.common
{
    public class XmlStocksSerializer
    {
        private const string _xmlPah = "~/App_Data/DarkPoolStockMarket.xml";
        private  readonly ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);        
        private static XmlStocksSerializer _instance = new XmlStocksSerializer();
        public List<DarkPoolStockModel> xmlDarkPoolStockModel { get; set; }
        private XmlStocksSerializer()
        {
            xmlDarkPoolStockModel = SerializedXml();
            
        }

        private List<DarkPoolStockModel> SerializedXml()
        {
            _logger.Info("get all the stocks from xml");
            var filePath = HostingEnvironment.MapPath(_xmlPah);
            XmlDocument doc = new XmlDocument();
            doc.Load(filePath);
            string jsonText = JsonConvert.SerializeXmlNode(doc);

            var first = jsonText.IndexOf("[{\"Symbol");
            var end = jsonText.IndexOf("}}");
            var subString = jsonText.Substring(first, end - first);
            var stockslst = JsonConvert.DeserializeObject<List<DarkPoolStockModel>>(subString);

            return stockslst;
        }

        public static XmlStocksSerializer GetInstance()
        {
            return _instance;
        }
    }
}