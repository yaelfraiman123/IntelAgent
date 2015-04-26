using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.OData;
using IntelAgentWebApi.Models;
using System.Web.Http.Cors;

namespace IntelAgentWebApi.Controllers
{
    [EnableCorsAttribute("*", "*", "*")]
    public class DarkPoolStocksController : ApiController
    {
       
        public IQueryable<DarkPoolStockModel> Get()
        {
            var repositoryProduct = new DarkPoolStockRepository();
            return repositoryProduct.Retrieve().AsQueryable();
        }



        // GET: api/Products/5
        public DarkPoolStockModel Get(string symbol)
        {
            DarkPoolStockModel result;
            var darkPoolStocksRepository = new DarkPoolStockRepository();
            var stocks = darkPoolStocksRepository.Retrieve();
            result = stocks.FirstOrDefault(x => x.Symbol == symbol);
            return result;
        }

    }
}
