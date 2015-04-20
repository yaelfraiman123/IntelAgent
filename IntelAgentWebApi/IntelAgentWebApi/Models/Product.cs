using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IntelAgentWebApi.Models
{
    public class Product
    {
        public string Description  { get; set; }
        public string ProductCode { get; set; }
        public decimal Price { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public DateTime RealseDate { get; set; }
    }
}