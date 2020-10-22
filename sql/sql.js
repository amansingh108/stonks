const mysql = require('mysql');

//connect to db
let con = mysql.createConnection({
  host:'localhost',
  user:'murmu',
  password:'murmu',
  database:'webster'
});


//insertion for any table
function insert(fieldList,dataList,tableName,callback){
  let dataTuple = dataList.join();
  let fieldTuple = fieldList.join();
  let query = `INSERT INTO ${tableName}(${fieldTuple}) VALUES(${dataTuple})`;
  con.query(query,(err,res)=> callback(err,res));
}

//update for any table
function update(fieldObj,callback){
  //pass
}

//get all tuples
function show(tableName,callback){
  let query =  `SELECT * FROM ${tableName}`;
  con.query(query,(err,res) => callback(err,res))
}


//insert into users table
function insertUser(userObj,callback){
  //NOTE: check if user already exists
  fieldList = ['id','name','email','password']
  dataList = ["'"+userobj.id+"'",
              "'"+userobj.name+"'",
              "'"+userobj.email+"'",
              "'"+userobj.password+"'" ]
  insert(fieldList,dataList,'users',callback);
}



exports.insert = insert;
exports.insertUser = insertUser;
exports.show = show;
exports.con = con;
