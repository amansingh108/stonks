const http = require('http');

const PORT = 5000; //change PORT here

//server listening to PORT
http.createServer((req,res)=>{
  res.writeHead(200,{"content-type":"text/plain"});
  res.write("Hello World!");
  res.end();
}).listen(PORT);
