var http = require('http')
  , devServer = '/DMZDEVSERVER'
  , fs = require('fs')
  , url = require('url')
  , mime
  , types =
    { 'html': 'text/html'
    , 'htm': 'text/html'
    , 'css': 'text/css'
    , 'js': 'application/javascript'
    , 'json': 'application/json'
    , 'png': 'image/png'
    , 'gif': 'image/gif'
    , 'jpg': 'image/jpeg'
    , 'jpe': 'image/jpeg'
    , 'jpeg': 'image/jpeg'
    }
  ;

mime = function (file) {
   var place = file.lastIndexOf('.')
     , result = "text/plain"
     , ext
     ;
   if (place >= 0) {
      ext = file.slice(place + 1);
      if (types[ext]) { result = types[ext]; }
   }
   console.log("mime-type: " + file + ' -> ' + result);
   return result;
}

http.createServer(function (request, result) {
   var parts = url.parse(request.url)
     , file = "." + parts.pathname
     ;

   if (parts.pathname === devServer) {
      console.log("Send Dev Server Info");
      result.writeHead(200, {'Content-Type': mime('.json')});
      result.end('{"version": 1}');
      return;
   }

   fs.stat(file, function (err, stats) {
      if (err) {
         console.log("Failed to stat: " + file + " reason: " + err);
         result.writeHead(404);
         result.end();
      }
      else {
         if (stats.isDirectory()) {
            file = file + "index.html";
         }
         fs.readFile(file, function(err, data) {
            if (err) {
               console.log("Failed to read: " + file + " reason: " + err);
               result.writeHead(404);
               result.end();
            }
            else {
               console.log("Send file: " + file);
               result.writeHead(200, {'Content-Type': mime(file)});
               result.end(data);
            }
         });
      }
   });
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
