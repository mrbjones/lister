var http = require("http");
var express = require('express');
var url = require('url');

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

function getter(cb) {
db.list('cars')
.then(function (result) {
  var items = result.body.results;
  cb(JSON.stringify(items))
})};

http.createServer(function(request, response) {
    var queryData = url.parse(request.url, true).query;
/*
if (queryData.o =="p" || queryData.o =="g")
{  response.writeHead(200, {"Content-Type": "text/plain"});};
*/
 if (queryData.o == "p")
{ putter( function(resp)
 {response.write("<br>" + resp);
 });
} 
  if (queryData.o == "g")
{ getter( function(resp)
 { response.write("<br>" + resp);
 });
} 
if (queryData.o !="p" && queryData.o !="g")
{
response.writeHead(200, {"Content-Type": "text/html"});
response.write("<form name=myf1><br>make<input name=make><br>model<input name=model><br>year<input name=year><br>color<input name=color><br><input type=submit>");
}
response.end();
 
 


  
  
}).listen(process.env.VCAP_APP_PORT);
