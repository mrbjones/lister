var http = require('http');
var port = parseInt(process.env.PORT,10);
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hellold\n');
}).listen(port, '0.0.0.0');
console.log('Serverning at http://0.0.0.0:' + port.toString() + '/');
