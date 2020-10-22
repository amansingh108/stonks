const sql = require('../sql/sql');
const util = require('./stock_util')
let stock_list = []
let stock_obj = {}

//check if stock_engine started
let stock_size = () => stock_list.length;


let gettingFullList = async () =>
{
  return new Promise((resolve,reject)=>{
    sql.show('stocks',(err,res)=>{
      if(err)
        reject(err);
      else
        resolve(res);
    });
  });
}



//alter value based on high/low %
//NOTE: check if async/synce
function nextVal(value){
  let high = 3;
  let low = -3;

  //generate random % between given range
  let percent = Math.random()*(high-low)+low;

  return value+value*percent/100;
}


//change valuation after given frequency
async function start(){
  console.log('stock market started....');
  while(true){
  await gettingFullList().then(res => stock_list = res)
                       .catch(err => console.log(err))

  console.log(stock_list);

  //link js object to stock_list
  // change in list is visible through this js object
  for (row of stock_list){
    for (key in row)
     {
       if(key === 'code')
        stock_obj[row[key]] = row
     }
  }


  while(true){

    util.asyncForEach(stock_list,(object,index,array)=>{
       //print live data here
       console.log(stock_obj["MNNIT"].name,stock_obj["MNNIT"].stk);
       array[index].val = nextVal(object.val);
    });

    await util.sleep(1); //adjust frequency here sleep(seconds)
  }
}
}


//list company names here
async function listCompanies(){
  asyncForEach(stock_list,(object,index,array)=>{
    console.log(object.name);
  })
}

//get all company db tuples
function getAll(callback){
  sql.show('stocks',(err,res)=>{
    callback(err,res);
  })
}


//get valuation by company code
function getLive(callback){
  if(stock_list == 0)
   return callback(Error("stock not started yet"))
  callback(null,stock_list)
}


//get live price by company
function getPrice(company,stakePercent,callback){
  if((curr_stock = stock_obj[company]) == null)
   return callback(Error(`requested company not found : ${company}`))

  callback(null,curr_stock.val*stakePercent)
}

function addStake(company,stake,callback){
  let curr_stake = stock_obj[company].stk;

  if(curr_stake < stake)
   return callback(Error(`insuffienct stakes : ${company}`));
  stock_obj[company].stk = curr_stake + stake;
  callback(null,stock_obj[company])
}

// // NOTE for testing ONLY
// async function test(){
//   start();
//   await util.sleep(3);
//   stock_obj["MNNIT"].stk = 99;
//   console.log(stock_obj["MNNIT"]);
// }
//
// test();

exports.start = start;
exports.getAll = getAll;
exports.gettingFullList = gettingFullList;
exports.getLive  = getLive;
exports.getPrice = getPrice;
exports.addStake = addStake;
