const stock = require('./stock_engine');
const stock_list = stock.stock_list;
const stock_obj = stock.stock_obj;


const util = require('./stock_util')
const sql = require('../sql/sql');


async function test(){
  stock.start();
  await util.sleep(3);
  console.log(stock.stock_obj);
}


//getAll(callback)
const getAll = (callback) => {
  const stocks = stock_obj;
  callback(stocks)
}

//getPrice(company,stakePercent,callback)

//addStake(company,stakePercent,callback)

//start()

getAll(async (stocks)=>{
  stock.start();
  await util.sleep(1)
  stocks["MNNIT"].val = 2
  await util.sleep(3)
  console.log(stocks);
})

//setting the export object
const stock_observer = {};
module.exports = stock_observer;
