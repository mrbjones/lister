
var http = require("http");
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
var db = require("orchestrate")(orchestrate_api_key,orchestrate_api_endpoint);

function putter(cb) {
db.put('cars', 'brettsvwgti', {
  "make": "Volkswagen",
  "model": "GTI S",
  "color": "Black",
  "year": "2015"
},false);
 cb("success :!");

};

http.createServer(function(request, response) {
  response.writeHead(200, {"ContenType": "text/plain"});
  response.write("start");
 putter( function(resp)
 {response.write(resp);});
 response.end();


  
  
}).listen(process.env.VCAP_APP_PORT);
