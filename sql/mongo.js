const url = 'mongodb://localhost:27017';
const {MongoClient} = require('mongodb');
const client = new MongoClient(url,{ useNewUrlParser: true, useUnifiedTopology: true });


let getdb = () => client.connect();
dbPromise = getdb();    //global db promise



const insert = (obj,collection,callback) =>{
  dbPromise
      .then((db_client)=>{
        db = db_client.db(collection)

        var options = {returnOriginal:false}

        db.collection('user_data').insertOne(obj)
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


exports.insert = insert;
