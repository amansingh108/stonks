const router = require('express').Router();
const handler = require('./client_handler')
var SSE = require('sse-nodejs')

router.get('/all',(req,res)=>{
  handler.getAll((err,rows)=>{
    if(err)
      return console.log(err);
    let response = {
       "status":"success",
       "data":rows
     }
    console.log("RESPONSE",response);
    res.header({'content-type':'application/json'})
    res.send(response);
    res.end();
  })
})

router.get('/live/:company',(req,res)=>{
    console.log('Got /events');
    var app = SSE(res);

    handler.getCompany(req.params.company,(err,obj)=>{
      app.sendEvent('getstock',obj,1000);
    })

    app.disconnect(function () {
        console.log("disconnected");
    });

    app.removeEvent('getstock', 86400000);

  });


//get live company obj
router.get('/company/:stock',(req,res,next)=>{
  console.log(`request received for /browse/${req.params.stock}`);

  handler.getCompany(req.params.stock.toUpperCase(),(err,obj)=>{
    let response = {
      'status' : 'success',
      'data' : obj
    }
    if(obj == null)
      response = {
        'status' : 'fail',
        'message' : 'COMPANY_DOES_NOT_EXIST'
      }
    res.header({'content-type':'application/json'})
    res.send(JSON.stringify(response))
    res.end()
  })

  next()
})

router.get('/user/:email',(req,res)=>{
  console.log(`request received for /user/:${req.params.email}...`);
  handler.getUser(req.params.email,(err,userobj) => {
    console.log(userobj);
    if(err)
     {
       console.log(err);
       throw err;
       res.end();
     }

    let response = {
      "status":"success",
      "data" : userobj
    }
    res.header({'content-type':'application/json'})
    res.send(JSON.stringify(response));
    res.end();
  })
})

//change the fav of user
router.post('/fav/',(req,res)=>{

  console.log(`request received for /fav`);
  console.log('REQUEST',req.body);
  //for add request
  if(req.body.action == 'add')
   {
     handler.addFav(req.body.email,req.body.code,(err,result)=>{
      response = {'status' : 'success','data' : result}
       if(err){
       response = {'status' : 'error','message' : 'COULD_NOT_ADD_FAV'}
        }
        res.header({'content-type':'application/json'})
        res.send(response)
        res.end()
      })
   }
  else //for removing fav
  {
    handler.removeFav(req.body.email,req.body.code,(err,result)=>{
    response = {'status' : 'success','data' : result}
    if(err){
      response = {'status' : 'error','message' : 'COULD_NOT_REMOVE_FAV'}
    }
    res.header({'content-type':'application/json'})
    res.send(response)
    res.end()
  })
  }

})

//buying a stock based on email by request
router.post('/buy/',(req,res)=>{
  console.log(`request received for /buy`);
  console.log('REQUEST',req.body);

  handler.buy(req.body.email,req.body.company,req.body.stake,(err,result)=>{
    if(err)
      {
        console.log(err);
        throw err;
        res.end();
      }
    res.header({'content-type':'application/json'})
    res.send(JSON.stringify(result))
    res.end()
  })
})

//selling a stock based on email by request
router.post('/sell/',(req,res)=>{
  console.log('request received for /sell')
  console.log('REQUEST',req.body);

  let email = req.body.email
  let sellingStake = req.body.sellingStake
  let holding = req.body.holding

  res.header({'content-type':'application/json'})
  handler.sell(email,holding,sellingStake,(err,result)=>{

    let response = {
      'status' : 'success',
      'data' : result
    }

    if(err)
     {
       let response = {
         'status' : 'failed',
         'message' : 'FAILED_TO_SELL'
       }
     }

       res.send(JSON.stringify(response))
       res.end()
  })


})


// add a new fav stock
router.post('/pushfav',(req,res)=>{
  console.log('request received for /fav');
  res.header({'content-type':"application/json"})
  let response = {
    status : 'success',
    data : 'push'
  }

  res.send(JSON.stringify(response))
  console.log(req.body);
  res.end();
})

// remove a fav stock
router.post('/pullfav',(req,res)=>{
  console.log('request received for /fav');
  res.header({'content-type':"application/json"})
  res.send({
    status : 'success',
    data : 'pull'
  })
  console.log(req.body);
  res.end();
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



module.exports = router
