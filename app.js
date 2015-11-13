
var http = require("http");
var db = require("orchestrate");


if (process.env.VCAP_SERVICES) 
{
var services = JSON.parse(process.env.VCAP_SERVICES);
var orchestrateConfig = services["orchestrate"];
if (orchestrateConfig) {
    var node = orchestrateConfig[0];
orchestrate_api_key = node.credentials.ORCHESTRATE_API_KEY
orchestrate_api_endpoint = node.credentials.ORCHESTRATE_API_HOST
  }
};

function putter(cb) {
var1=''
db.put('cars', 'brettsvwgti', {
  "make": "Volkswagen",
  "model": "GTI S",
  "color": "Black",
  "year": "2015"
})
.then(function (putt1) {
 var1='success !';
})
cb(var1)
};

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
 putter( function(putt1)
 {response.write(putt1);response.end();     });
  
  
}).listen(process.env.VCAP_APP_PORT);
