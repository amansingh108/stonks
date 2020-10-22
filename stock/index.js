const express = require('express')
const router = require('./route.js')
const cors = require('cors')
const PORT = 3000

const app = express();

const server = require('http').createServer(app);
//
// app.use(cors())
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', "*");
   res.header("Access-Control-Allow-Headers", "*");
   if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }});
app.use(express.json());
app.use('/',router);


server.listen(3000,()=>console.log(`stock listening at ${PORT}`));
