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
        public float PctChg { get; set; }
        [DataMember]
        public float Ask { get; set; }
        [DataMember]
        public float Bid { get; set; }
        [DataMember]
        public float AskQty { get; set; }
        [DataMember]
        public float BidQty { get; set; }

    }
     [DataContract]
    public class DarkPoolStocks
    {
         [DataMember]
        public List<DarkPoolStockModel> DarkPoolStock { get; set; }
    }
}