const router = require('express').Router();
const handler = require('./client_handler')

router.get('/all',(req,res)=>{
  handler.getAll((err,rows)=>{
    if(err)
     return console.log(err);
    else
     res.send({
       "status":"success",
       "data":rows
     });
     res.end();
  })
})

router.get('/user/:username',(req,res)=>{
  handler.getUser(req.params.username,(err,obj) => {
    if(err)
     {
       console.log(err);
       throw err;
       res.end();
     }

    let response = {
      "status":"success",
      "data" : obj
    }
    console.log("RESPONSE",response);
    console.log(req.params);
    res.send();
    res.end();
  })
})

//getPrice
//REQUEST{name:,stake:}
router.post('/price',(req,res)=>{
  console.log("REQUEST",req.body);
  handler.getPrice(req.body.name,req.body.stake,(err,val)=>{
    if(err)
     {
       console.log("RESPONSE","");
       res.end({ "status":"fail" });
       return console.log(err);
     }
    let response = {
      "status":"success",
      "data":{'price' : val}
    }
    console.log("RESPONSE",response);
    res.send(response);
    res.end();
  })
})

router.get('/user/:username/add/:company',(req,res)=>{
  console.log(req.params);
})

// /:username
// /browse
// /:username/holdings
// /:username/transactions
// /:username/fav

module.exports = router
