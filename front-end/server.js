//loading environment variables
if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express')
var app = require('express-ws-routes')();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')


//using the api locally
const stock_router = require('../stock/route')
const stock_engine = require('../stock/stock_engine')

//cors
const cors = require('cors')

//initializing passport
const initializedPassport = require('./passport-config')
initializedPassport(passport)

//starting the stock_engine
stock_engine.start()

//setting socket
var experssWs = require('express-ws')(app)

app.set('view-engine','ejs')
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
  secret:'process.env.SESSION_SECRET', //holds the secrete environment variable
  resave:false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"views")));  //styles and scripts directory

//parsing the request body
app.use(express.json());
app.use(express.urlencoded({
  extended : true
}));


//use routes of api
const routes = require('./routes/routes.js')
app.use(stock_router);
app.use('/',routes);


//server listening
app.listen(5000,()=>console.log('server listening at 5000'));
