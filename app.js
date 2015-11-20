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
response.writeHeader(200, {"Content-Type": "text/html"});
response.write("<!doctype html><html lang=\"en\"><head>  <meta charset=\"UTF-8\"><html><head><title>Brett's Car-o-rama!</title>  <script src=\"//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.1/angular.min.js\"></script>");
response.write("<script src=\"//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.1/angular-sanitize.js\"></script>")

response.write("</head><body>");
response.write("<br><br><div id=title>Brett's Car-o-rama!</div><br>")
response.write("<br><br><div  ng-app=\"getter\" id=main ng-controller=\"ListCarz\">")
response.write("<div ng-bind=\"carslist\" ng-init=\"update(carslist)\"></div>")
/*
response.write("<table><tr ng-repeat=\"for each car in carslist\">")
response.write("<td>{{car.make}}</td>")
response.write("</tr></table>")
*/
response.write("Here's some stuff!")

response.write("</div>")
response.write("<div ng-app=\"putter\" ng-controller=\"ExampleController\" id=footer>")

response.write("<form  novalidate class=\"simple-form\" ><table><tr><td>name</td><td><input ng-model=\"carz.key\"><input style=display:none;  value='p'  ng-model=\"carz.o\"></td></tr><tr><td>make</td><td><input  ng-model=\"carz.make\"></td></tr><tr><td>model</td><td><input  ng-model=\"carz.model\"></td></tr><tr><td>year</td><td><input  ng-model=\"carz.year\"></td></tr><tr><td>color</td><td><input  ng-model=\"carz.color\"></td></tr><tr><td colspan=2><input type=button  ng-click=\"update(carz)\" value=\"Save\" ></td></tr></table></form>");
/*
response.write("<form  novalidate class=\"simple-form\" >name<input name=key ng-model=\"carz.key\"><input type=hidden name=o value='p'  ng-model=\"carz.o\">make<input name=make  ng-model=\"carz.make\">model<input name=model  ng-model=\"carz.model\">year<input name=year  ng-model=\"carz.year\">color<input name=color  ng-model=\"carz.color\"><input type=button  ng-click=\"update(carz)\" value=\"Save\" ></form>");
response.write("<script>  angular.module('formExample', [])    .controller('ExampleController', ['$scope', function($scope) {   $scope.master = {};$scope.update = function(carz) { $scope.master = angular.copy(carz);};$scope.reset = function() {   $scope.carz = angular.copy($scope.master);}; $scope.reset();}]);</script>");
response.write("<script>  angular.module('formExample', [])    .controller('ExampleController', ['$scope', function($scope) { $scope.master = {}; $scope.update = function(carz) {var m1=carz.make; alert(m1);  });     }]);")

*/

response.write("</div>")



response.write("<script>  angular.module('putter', [])    .controller('ExampleController', ['$scope', '$http', function($scope,$http) {$scope.update = function(carz)  { $http({ url: 'http://btjweb2.uswest.appfog.ctl.io/app.js',    method: \"GET\",    params: {o: 'p',key: carz.key, make: carz.make, model: carz.model, color: carz.color, year:carz.year}}).success(function(data, status, headers, config) { alert(data) });   };     }]);")
response.write("</script>")

response.write("<script>  angular.module('getter', [])    .controller('ListCarz', ['$scope', '$http', function($scope,$http) {$scope.update = function(carslist)  { $http({ url: 'http://btjweb2.uswest.appfog.ctl.io/app.js',    method: \"GET\",    params: {o: 'g'}}).success(function(data) {  $scope.carslist = angular.FromJSON(data) });   };     }]);")
response.write("</script>")

response.end();
    
    
}

 
 


  
  
}).listen(process.env.VCAP_APP_PORT);
