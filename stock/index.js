const express = require('express')
const router = require('./route.js')
const cors = require('cors')
const stock = require('./stock_engine')

const PORT = 5000

const app = express();

const server = require('http').createServer(app);

stock.start();


app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use('/',router);


server.listen(PORT,()=>console.log(`stock listening at ${PORT}`));
