const stock = require('./stock_handler');
const util = require('./stock_util')

async function printLive(company,callback){
  while(true){
    stock.getVal(company,(err,data)=>{
      if(err)
       console.log(`company not found : ${company}`);
      else
       console.log(data);
    })
  }
}

//live list of all stocks
let getAll = (callback) =>{
  stock.getLive(callback)
}

//get price of given stock
let getPrice = (company) => {
  if(stock.stock_size() == 0)
   return console.log(error);
  return stock
}

let addStake = (company,stake,callback) => {
  stock.addStake(company,stake,callback)
}

//setting the export object
const stock_observer = {};
stock_observer.getAll = getAll;
stock_observer.printLive = printLive;
stock_observer.addStake = addStake;

module.exports = stock_observer;
