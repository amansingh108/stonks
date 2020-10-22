const router = require('express').Router();
const stock = require('./stock_observer')

router.get('/all',(req,res)=>{
  stock.getList((err,rows)=>{
    if(err)
     return console.log(err);
    else
     res.send(rows);
     res.end();
  })
})

module.exports = router
