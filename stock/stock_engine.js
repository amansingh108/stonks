const util = require('./stock_util');

let stock_list = []
let stock_obj = {}

//check if stock_engine started
let stock_size = () => stock_list.length;


let gettingFullList = async () =>
{
  const sql = require('../sql/sql');
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
       //console.log(stock_obj);
       array[index].val = nextVal(object.val);
    });

    await util.sleep(1); //adjust frequency here sleep(seconds)
  }
}
}


exports.start = start;
exports.stock_obj = stock_obj;
exports.stock_list = stock_list;
