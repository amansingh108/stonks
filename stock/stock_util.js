//async iterate
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index,array);
  }
}


//sleep
function sleep(s){
  return new Promise(resolve => setTimeout(resolve,s*1000));
}


exports.asyncForEach = asyncForEach;
exports.sleep = sleep;
