
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

var query = require('url').parse(req.url,true).query;
var option = query.option;
if (!option){ option="g"};


function putter(cb) {
db.put('cars', 'brettsvwgti', {
  "make": "Volkswagen",
  "model": "GTI S",
  "color": "Black",
  "year": "2015"
},false);
 cb("success :!");
};

function getter(cb) {
db.list('collection')
.then(function (result) {
  var items = result.body.results;
  cb(items)
})
};



http.createServer(function(request, response) {
  response.writeHead(200, {"ContenType": "text/plain"});
  response.write("start");
 
 if (option == "p")
{ putter( function(resp)
 {response.write("<br>" + resp);});
} 
  if (option option == "g")
{ gettter( function(resp)
 {response.write("<br>" + resp);});
} 
 
 
 
 
 response.end();


  
  
}).listen(process.env.VCAP_APP_PORT);
