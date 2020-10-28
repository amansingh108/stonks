//loading environment variables
if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')
const stock_router = require('../stock/route')
const stock_engine = require('../stock/stock_engine')

//cors
const cors = require('cors')

//initializing passport
const initializedPassport = require('./passport-config')
initializedPassport(passport)

//starting the stock_engine
stock_engine.start()

app.set('view-engine','ejs')
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
  secret:'process.env.SESSION_SECRET',
  resave:false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"views")));  //styles and scripts directory


app.use(express.json());
app.use(express.urlencoded({
  extended : true
}));

const routes = require('./routes/routes.js')
//use routes of api
app.use(stock_router);
app.use('/',routes);

app.listen(5000,()=>console.log('server listening at 5000'));
