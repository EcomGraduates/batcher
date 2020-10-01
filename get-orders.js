const https = require('https')
function getOrders() {
    let api_key = "https://abc:123@shopifystore"

    let url = ".myshopify.com/admin/api/2019-07/orders.json?status=open&financial_status=paid&fulfillment_status=unshipped&limit=250"
    https.get(api_key + url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
       
          let error;
          if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                              `Status Code: ${statusCode}`);
          } 
          if (error) {
            console.error(error.message);
            res.resume();
            return;
          }

          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', (chunk) => { rawData += chunk; });
          res.on('end', () => {
            try {
              const parsedData = JSON.parse(rawData);
              return parsedData;
            } catch (e) {
              console.error(e.message);
            }
          });
        }).on('error', (e) => {
          console.error(`Got error: ${e.message}`);
    });
}
document.querySelector('#getOrders').addEventListener('click', getOrders)

