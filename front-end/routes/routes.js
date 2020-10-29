const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

//local sql
const sql = require('../../sql/sql');

//local mongodb
const mongo = require('../../sql/mongo')


router.get('/profile',checkAuthenticated,(req,res)=>{
  res.render('profile.ejs',{name:req.user.name,email:req.user.email})
})

router.get('/browse',checkAuthenticated,(req,res)=>{
  res.render('browse.ejs',{name:req.user.name,email:req.user.email})
})

router.get('/browse/:company',checkAuthenticated,(req,res)=>{
  res.render('company.ejs',{company:req.params.company,name:req.user.name,email:req.user.email})
})

router.get('/',checkAuthenticated,(req,res,next)=>{
  res.redirect('/profile')
})

router.get('/profile/holdings',checkAuthenticated,(req,res)=>{
  res.render('holding.ejs',{name:req.user.name,email:req.user.email})
})

router.get('/profile/favs',checkAuthenticated,(req,res)=>{
  res.render('fav.ejs',{name:req.user.name,email:req.user.email})
})

router.get('/profile/transactions',checkAuthenticated,(req,res)=>{
  res.render('transaction.ejs',{name:req.user.name,email:req.user.email})
})



router.get('/login',checkNotAuthenticated,(req,res)=>{
  res.render('login.ejs');
})

router.post('/login',checkNotAuthenticated,passport.authenticate('local',{
  successRedirect: '/profile',
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

    let mongoUserInstance = {
      'email' : req.body.email,
      'funds' : 1000,
      'fav' : [],
      'holding' : [],
      'transaction' : []
    }

    mongo.insert(mongoUserInstance,'webster',(err,res)=>{
      if(err)
       throw err
      console.log(res);
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
