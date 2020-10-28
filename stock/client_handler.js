//setting MongoDB
const url = 'mongodb://localhost:27017';
const {MongoClient} = require('mongodb');
const client = new MongoClient(url,{ useNewUrlParser: true, useUnifiedTopology: true });

const util = require('./stock_util')

let getdb = () => client.connect();
dbPromise = getdb();    //global db promise

const interface = require('./stock_interface')
const stock = require('./stock_engine')  //for testing


const mongoUpdate = (searchQuery,updateQuery,callback) =>{
  dbPromise
    .then((db_client)=>{
      db = db_client.db('webster')

      var options = {returnOriginal:false}

      db.collection('user_data').findOneAndUpdate(searchQuery,updateQuery,options)
       .then((updatedDocument)=>{
         if(updatedDocument)
          callback(null,updatedDocument);
         else
          callback(Error("no matching document found"));
       })
        .catch(err => callback(err))


    })
    .catch((err)=>{
      callback(err)
    })
}

const userFund = (email,callback)=>{
  dbPromise
    .then((db_client)=>{
      db = db_client.db('webster')

      var searchQuery = {"email":email} //searching by mail
      var projectionQuery = { "projection":
        {
          "funds":1,
          "_id":0
        }
      }

      //get the funds
      db.collection('user_data').findOne(searchQuery,projectionQuery)
       .then((res)=>{
          callback(null,res.funds);
       })
       .catch(err => callback(Error(`failed to get funds for user : ${email}`)))

    })
    .catch((err)=>{
      callback(err)
    })
}

//get all the objects
const getAll = (callback) =>{
  interface.getAll(callback);
}

const getUser = (email,callback) => {
  dbPromise
    .then((db_client)=>{

        db = db_client.db('webster')
        var query = {"email":email}
        db.collection('user_data').findOne(query)
         .then(res => callback(null,res))
         .catch(err => callback(err))
    })
    .catch((err)=>{
      callback(err)
    })
}


const addFav = (email,company,callback)=>{
  dbPromise
    .then((db_client)=>{
      db = db_client.db('webster')

      var searchQuery = {"email":email}
      var updateQuery = {
        $push:{
          fav:company
        }
      }

      var options = { returnNewDocument : true};

      db.collection('user_data').findOneAndUpdate(searchQuery,updateQuery,options)
       .then((updatedDocument)=>{
         if(updatedDocument)
          callback(null,updatedDocument);
         else
          callback(Error("no matching document found"));
       })
        .catch(err => callback(Error("failed to find and update document")))


    })
    .catch((err)=>{
      callback(err)
    })
}


const removeFav = (email,company,callback) =>{
  dbPromise
    .then((db_client)=>{
      db = db_client.db('webster')

      var searchQuery = {"email":email} //searching by mail
      var updateQuery =
        {
          $pull :{fav:company}
        }

      //running the query here
      db.collection('user_data').update(searchQuery,updateQuery)
       .then((report)=>{
          callback(null,report);
       })
       .catch(err => callback(Error("failed to update document")))

    })
    .catch((err)=>{
      callback(err)
    })
}

const userFundPromise = (email) => new Promise((resolve,reject)=>{
  userFund(email,(err,fund)=>{
    if(err)
     reject(err)
    resolve(fund)
  })
})

const pricePromise = (company,stakePercent) =>  new Promise((resolve,reject)=>{
    interface.getPrice(company,stakePercent,(err,val)=>{
      if(err)
       reject(err)
      resolve(val)
    })
  })

const getPrice = async (company,stakePercent,callback) => {
  pricePromise(company,stakePercent,callback)
    .then(val => callback(null,val))
    .catch(err => callback(err))
}

const buy = async (email,company,stakePercent,callback) =>{

  let value = 0;
  await pricePromise(company,stakePercent)
        .then(res => value = res)
        .catch(err => console.log(err))

  let fund = 0;
  await userFundPromise(email)
        .then(res => fund = res)
        .catch(err => console.log(err))


  if(value > fund)
      return callback(Error(`insuffienct funds \n funds less than stock value`))

  //reduce stake in stocks table
  stock_observer.addStake(company,-stakePercent,callback);

  let searchQuery = {"email":email}
  //set funding
  let updateQuery = {
    $set:{
      "funds": fund-value
    }
  }

  //update funds after buying
  mongoUpdate(searchQuery,updateQuery,(err,res)=>{
    console.log(res);
  })


  const holding = {
    "name" : company,
    "stake" : stakePercent,
    "price" : value,
    "date" : new Date().toISOString()
  }

  searchQuery = {"email" :email}
  //push holding to holding[] in db
  updateQuery = {
    $push:{
      "holding":holding
    }
  }

  //add holding to db
  mongoUpdate(searchQuery,updateQuery,(err,res)=>{
    console.log(res);
  })

  console.log(new Date().toISOString());
  const transaction = {
    date : new Date().toISOString(),
    user : email,
    profit : null
  }
  //record transaction here
  //let transaction = {}
  callback(null,transaction);
}

const sell = async (email,holding,stakePercent,callback) =>{

  let value = 0;
  await pricePromise(holding.name,stakePercent)
        .then(res => value = res)
        .catch(err => console.log(err))

  let fund = 0;
  await userFundPromise(email)
        .then(res => fund = res)
        .catch(err => console.log(err))

  let searchQuery = {"email":email}
  //set funding
  let updateQuery = {
  $set:{
      "funds": fund+value
        }
  }

  //update funds after buying
  mongoUpdate(searchQuery,updateQuery,(err,res)=>{
    console.log(res);
  })

  if(holding.stake == stakePercent)
    {
      console.log('total');

      const searchQuery = {"email":email}
      const updateQuery = {
        $pull:{
          "holding": holding
          }
        }

      //remove holding
      mongoUpdate(searchQuery,updateQuery,callback);
    }
  else
    {
      console.log('partial');

      const searchQuery = {"email":email}

      let updateQuery = {
        $pull :{
          "holding":holding
        }
      }

      //remove current holding
      mongoUpdate(searchQuery,updateQuery,callback);

      //partial stock transaction
      holding.price = holding.price - stakePercent*holding.price;
      holding.stake = holding.stake - stakePercent;

      updateQuery = {
        $push :{
          "holding":holding
        }
      }

      //push updated holding
      mongoUpdate(searchQuery,updateQuery,callback);
    }

    //restore global stake
    stock_observer.addStake(holding.name,stakePercent,callback);



    //record transaction here
    //let transaction = {}
    callback(null,transaction)

}


exports.getPrice = getPrice
exports.getAll = getAll
exports.getUser = getUser
exports.addFav = addFav
exports.removeFav = removeFav
exports.buy = buy
exports.sell = sell
