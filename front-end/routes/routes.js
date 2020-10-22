const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

//local sql setup
const sql = require('../../sql/sql');

router.get('/',checkAuthenticated,(req,res)=>{
  res.render('index.ejs',{name : req.user.name,email : req.user.email});
  console.log(req.user);
})


router.get('/login',checkNotAuthenticated,(req,res)=>{
  res.render('login.ejs');
})

router.post('/login',checkNotAuthenticated,passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true
}))

router.get('/register',checkNotAuthenticated,(req,res)=>{
  res.render('register.ejs');
})

router.post('/register',checkNotAuthenticated,async (req,res)=>{
  try{
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    userobj = {
      id: Date.now().toString(),
      name: req.body.name,
      email:req.body.email,
      password:hashedPassword
    };
    sql.insertUser(userobj,(err,result)=>{
      if(err)
       throw err
      console.log(result);
    })
    res.redirect('/login')
  }catch(e){
    res.redirect('/register')
    console.log(e);
  }
})

router.delete('/logout',(req,res)=>{
  req.logOut()
  res.redirect('/login')
})


router.get('/all',(req,res)=>{
  res.render('all.ejs')
})

function checkAuthenticated(req,res,next){
  if (req.isAuthenticated()){
    return next()
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return res.redirect('/')
  }
  next()
}


module.exports = router;
