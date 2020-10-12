const stock = require('./stock_handler');

//sleep
function sleep(s){
  return new Promise(resolve => setTimeout(resolve,s*1000));
}

async function getVal(company,frequency){
  while(true){
    stock.getVal(company,(err,data)=>{
      if(err)
       console.log(`company not found : ${company}`);
      else
       console.log(data);
    })
    await sleep(frequency);
  }
}


exports.getVal = getVal;
