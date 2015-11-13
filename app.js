
var http = require("http");
var orc = require("orchestrate");


if (process.env.VCAP_SERVICES) 
{
var services = JSON.parse(process.env.VCAP_SERVICES);
var orchestrateConfig = services["orchestrate"];
if (orchestrateConfig) {
    var node = orchestrateConfig[0];
orchestrate_api_key = node.credentials.ORCHESTRATE_API_KEY
orchestrate_api_url = node.credentials.ORCHESTRATE_API_HOST
  }
};

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(orchestrate_api_key)
  response.write("Hello World");
  response.end();
}).listen(process.env.VCAP_APP_PORT);
