using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace IntelAgentWebApi.Models
{
    [DataContract]
    public class DarkPoolStockModel
    {
        [DataMember]
        public string Symbol { get; set; }
        [DataMember]
        public string LastPrice { get; set; }
        [DataMember]
        public double PctChg { get; set; }
        [DataMember]
        public double Ask { get; set; }
        [DataMember]
        public double Bid { get; set; }
        [DataMember]
        public double AskQty { get; set; }
        [DataMember]
        public double BidQty { get; set; }

    }
     [DataContract]
    public class DarkPoolStocks
    {
         [DataMember]
        public List<DarkPoolStockModel> DarkPoolStock { get; set; }
    }
}