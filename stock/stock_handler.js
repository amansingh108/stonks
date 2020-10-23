const util = require('./stock_util');

//get live price by company
const getPrice = (company,stakePercent,callback) => {
  if((curr_stock = stock_obj[company]) == null)
   return callback(Error(`requested company not found : ${company}`))
  callback(null,curr_stock.val*stakePercent)
}


//add stake to a company
const addStake = (company,stake,callback) => {
  let curr_stake = stock_obj[company].stk;

  if(curr_stake < stake)
   return callback(Error(`insuffienct stakes : ${company}`));
  stock_obj[company].stk = curr_stake + stake;
  callback(null,stock_obj[company])
}

//print live data
const printLive = (company,callback) => {
  while(true){
    stock.getVal(company,(err,data)=>{
      if(err)
       console.log(`company not found : ${company}`);
      else
       console.log(data);
    })
  }
}

//get valuation by company code
const getLive = (callback) => {
  if(stock_list == 0)
   return callback(Error("stock not started yet"))
  callback(null,stock_list)
}


//get all company db tuples
const getAll = (callback) => {
  sql.show('stocks',(err,res)=>{
    callback(err,res);
  })
}

exports.getPrice = getPrice;
