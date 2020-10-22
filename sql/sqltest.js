const sql = require('./sql');
// sql.insert([3,`''`],'t',(err,res)=>{
//   if(err)
//    throw err
//   else
//    console.log(res);
// });


sql.show(`t`,(err,res)=>{
  if(err)
   throw err
  console.log(res);
});
