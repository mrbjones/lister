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
  cb(JSON.stringify(items, ['path', 'key', 'value', 'make', 'model', 'year', 'color']));
})};

function remover(keyer, cb) {
db.remove('cars', keyer, true);
 cb("successfully removed :!");
};


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

  if (queryData.o == "d")
  {
  ckey=queryData.key
 remover(ckey, function(resp)
 { response.write(resp);response.end();
 });
}
if (queryData.o !="p" && queryData.o !="g" && queryData.o !="d")
{
response.writeHeader(200, {"Content-Type": "text/html"});
response.write("<!doctype html><html lang=\"en\"><head>  <meta charset=\"UTF-8\"><html><head><title>Brett's Cars!</title>  <script src=\"//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.1/angular.min.js\"></script>");
response.write("<script src=\"//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.1/angular-sanitize.js\"></script>")
response.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"freestyler.css\" media=\"screen\" />")

response.write("</head><body ng-app=\"putter\"><center>");
response.write("<br><br><div id=title>BTJ's Cars</div><br>")
response.write("<div   id=main ng-controller=\"ListCarz\">")
response.write("<div ng-init=\"listcars()\"></div>")

response.write("<table><tr ng-repeat=\"car in carslist\">")

response.write("<td>{{car.path.key}}</td>")
response.write("<td>{{car.value.make}}</td>")
response.write("<td>{{car.value.model}}</td>")
response.write("<td>{{car.value.year}}</td>")
response.write("<td>{{car.value.color}}</td>")
response.write("<td><input type=button ng-click=\"deleter(car)\" name='X' value='X'>")
response.write("</tr></table>")


response.write("</div>")
response.write("<hr>")
response.write("<div  ng-controller=\"ExampleController\" id=footer>")

response.write("<form  novalidate class=\"simple-form\" ><table><tr><td>name</td><td><input ng-model=\"carz.key\"><input style=display:none;  value='p'  ng-model=\"carz.o\"></td></tr><tr><td>make</td><td><input  ng-model=\"carz.make\"></td></tr><tr><td>model</td><td><input  ng-model=\"carz.model\"></td></tr><tr><td>year</td><td><input  ng-model=\"carz.year\"></td></tr><tr><td>color</td><td><input  ng-model=\"carz.color\"></td></tr><tr><td colspan=2><input type=button  ng-click=\"update(carz)\" value=\"Save\" ></td></tr><tr><td ng-bind=\"responder\"></td></tr></table></form>");
response.write("</div></center></body>")



response.write("<script>var myApp=angular.module('putter', []);")
response.write("myApp.controller('ExampleController', ['$scope', '$http', function($scope,$http) {$scope.update = function(carz)  { $http({ url: 'http://btjweb3.uswest.appfog.ctl.io/app.js',    method: \"GET\",    params: {o: 'p',key: carz.key, make: carz.make, model: carz.model, color: carz.color, year:carz.year}}).success(function(data, status, headers, config) { $scope.responder=data });   };     }]);")
response.write("myApp.controller('ListCarz', ['$scope', '$http', function($scope,$http) {$scope.listcars = function()  { $http({ url: 'http://btjweb3.uswest.appfog.ctl.io/app.js',    method: \"GET\",    params: {o: 'g'}}).success(function(data) {$scope.carslist=[]; $scope.carslist=data });")
response.write(" $scope.deleter= function(car){ $http({ url: 'http://btjweb3.uswest.appfog.ctl.io/app.js',    method: \"GET\",    params: {o: 'd', key: car.path.key}}).success(function(data, status, headers, config) { alert(\"|\" + car.path.key) });   };  };     }]);")
response.write("</script>")

response.end();
    
    
}

 
 


  
  
}).listen(process.env.VCAP_APP_PORT);
