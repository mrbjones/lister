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

function putter(keyer,cma,cmo,cy,cco,cb) {
var jsonString = "{\"make\":\"" +cma+ "\", \"model\":\""+cmo+"\", \"year\":\""+cy+"\", \"color\":\""+cco+"\"}";
var jsonObj = JSON.parse(jsonString);
db.put('cars', keyer, jsonObj, false);
 cb("success :!");
};

function getter(cb) {
db.list('cars')
.then(function (result) {
  var items = result.body.results;
  cb(JSON.stringify(items, ['value'].['model']))
})};

http.createServer(function(request, response) {
    var queryData = url.parse(request.url, true).query;
/*
if (queryData.o =="p" || queryData.o =="g")
{  response.writeHead(200, {"Content-Type": "text/plain"});};
*/
 if (queryData.o == "p")
{ 
    cmake=queryData.make;
    cmodel=queryData.model
    cyear=queryData.year
    ccolor=queryData.color
    ckey=queryData.key
    
    putter(ckey,cmake,cmodel,cyear,ccolor, function(resp)
 {response.write(resp);response.end();
 });
} 
  if (queryData.o == "g")
{ getter( function(resp)
 { response.write(resp);response.end();
 });
} 
if (queryData.o !="p" && queryData.o !="g")
{
response.writeHead(200, {"Content-Type": "text/html"});
response.write("<form name=myf1><table><tr><td>name</td><td><input name=key></td></tr><tr><td>make</td><td><input name=make></td></tr><tr><td>model</td><td><input name=model></td></tr><tr><td>year</td><td><input name=year></td></tr><tr><td>color</td><td><input name=color></td></tr><tr><td colspan=2><input type=submit></td></tr></table>");response.end();
}

 
 


  
  
}).listen(process.env.VCAP_APP_PORT);
