const LocalStrategy = require('passport-local').Strategy // Passport.js strategy here
const bcrypt = require('bcrypt')

//local sql setup
const sql = require('../sql/sql')

//initializing the passport here
function initialize(passport){
  const authenticateUser = (email,password,done)=>{
    let query = `SELECT * from users where email = '${email}'`;
    sql.con.query(query,async (err,res)=>{
      if(err)
       throw err;

       if(res[0] == null){  //checking user tuple in db
         return done(null,false,{message: 'No user with that email'})
       }

       user = res[0]; //set the user from fetched res
       try{
         if(await bcrypt.compare(password,user.password)){
           return done(null,user)
         }else{
           return done(null,false,{message : 'Password incorrect'})
         }
       }catch(e){
         return done(e)
       }
    })

  }

  passport.use(new LocalStrategy({usernameField:'email'},
  authenticateUser))
  passport.serializeUser((user,done) => done(null,user.id));
  passport.deserializeUser((id,done) => {
    let query =  `SELECT * FROM users where id = ${id}`;
    sql.con.query(query,(err,res)=>{
      user = res[0];
      if(err)
       throw err;
      return done(null,user);
    })
  })

}

function setPassport(passport){

}

module.exports = initialize;
