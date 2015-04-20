using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.OData;
using IntelAgentWebApi.Models;

namespace IntelAgentWebApi.Controllers
{
    [EnableCorsAttribute("*","*","*")]
    public class ProductsController : ApiController
    {
        
        // GET: api/Products
        [EnableQuery()]
        public IQueryable<Product> Get()
        {
            var repositoryProduct = new ProductRepository();
            return repositoryProduct.Retrieve().AsQueryable();
        }



        // GET: api/Products/5
        public Product Get(int id)
        {
            Product result;
            var productRepository = new ProductRepository();
            if (id>0)
            {
                var products = productRepository.Retrieve();
                result = products.FirstOrDefault(x => x.ProductId == id);

            }
            else
            {
                result = productRepository.Create();
            }
            return result;
        }

        // POST: api/Products
        public void Post([FromBody]Product product)
        {
            var repostoryProduct = new ProductRepository();
            var newProduct = repostoryProduct.Save(product);

        }

        // PUT: api/Products/5
        public void Put(int id, [FromBody]Product product)
        {
            ProductRepository productRepository=new ProductRepository();
            var updateProduct = productRepository.Save(id, product);
        }

        // DELETE: api/Products/5
        public void Delete(int id)
        {
        }
    }
}
