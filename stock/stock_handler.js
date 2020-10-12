const clist = require('./stock_list').clist;

//sleep
function sleep(s){
  return new Promise(resolve => setTimeout(resolve,s*1000));
}

//async iterate
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index,array);
  }
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
  while(true){

    asyncForEach(clist,(object,index,array)=>{
       //print live data here
       // console.log(object.name,object.value);
       array[index].value = nextVal(object.value);
    });

    await sleep(1); //adjust frequency here sleep(seconds)
  }
}

async function getVal(company,callback){

  let promise = new Promise((resolve,reject)=>{
    asyncForEach(clist,(object,index,array)=>{
      if(object.name === company)
        return resolve(object.value);
    });
    reject(Error("company not found"));
  });

   return promise.then(res => callback(false,res))
                  .catch(err => callback(err));
}

//list company names here
async function listCompanies(){
  asyncForEach(clist,(object,index,array)=>{
    console.log(object.name);
  })
}




exports.start = start;            //start() to start the stock market
exports.getVal = getVal;          //getVal('company_name',(err,value)=>{...} ) ;
