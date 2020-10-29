const stock = require('./stock_engine');

const handler = require('./stock_handler')
const util = require('./stock_util')


//get list of all companies
const getAll = (callback) => {
  let stock_list = []
  stock.getList((list) =>{
    for(stock_obj of list){
      let obj = {
        'code' : stock_obj.code,
        'name' : stock_obj.name,
        'value' : stock_obj.val,
        'initial' : stock_obj.initial
      }
      stock_list.push(obj)
    }
  })
  if(stock_list.length == 0)
   return callback(Error("stock engine not started yet"))
  callback(null,stock_list)
}

//getPrice of stock
const getPrice = (company,stakePercent,callback) => {
  stock.getObj((stock_obj) => {
    if((curr_stock = stock_obj[company]) == null)
     return callback(Error(`requested company not found : ${company}`))
    callback(null,curr_stock.val*stakePercent)
  })
}

//getCompany obj
const getObj = (callback) => stock.getObj(callback)


//restore stake of a company
const addStake = (company,stake,callback) => {
  stock.getObj((stock_obj)=>{
    let curr_stake = stock_obj[company].stk;
    if(curr_stake < stake)
      return callback(null,{
        'error' : 'DEMAND_TOO_LARGE'
      });
    stock_obj[company].stk = curr_stake + stake;
    callback(null,stock_obj[company])
  })
}

const start = () => stock.start();


exports.getObj = getObj;
exports.addStake = addStake;
exports.getPrice = getPrice;
exports.start = start;
exports.getAll = getAll;
