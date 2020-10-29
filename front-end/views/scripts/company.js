// Display company information
function displayData(data){
  document.getElementById('name').innerHTML = data.name;
  document.getElementById('code').innerHTML = data.code;
  document.getElementById('stake').innerHTML = data.stk;
  document.getElementById('value').innerHTML = data.val;
}

//Notify user on fav
function changeFav(obj){
  document.getElementById('btn').innerHTML = 'waiting..'
  let email = document.getElementById('email').innerHTML.trim()

  let requestObj = obj
  requestObj['email'] = email

  sendFavRequest(requestObj)
}

//send fav request
function sendFavRequest(requestObj){

  //create request
  var request = new XMLHttpRequest()
  let email = document.getElementById('email').innerHTML.trim();
  //getting user object
  request.open('POST', `http://localhost:5000/fav`, true)
  request.setRequestHeader('content-type','application/json')

  request.onload = function () {
    var data = JSON.parse(this.response);
    console.log(data);
    checkFav()
  }
  console.log('request',JSON.stringify(requestObj));
  // Send request
  request.send(JSON.stringify(requestObj));
}


//get user details to check favorite status
function getUserObj(callback){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()
  let email = document.getElementById('email').innerHTML.trim();
  //getting user object
  request.open('GET', `http://localhost:5000/user/${email}`, true)

  request.onload = function () {
    var data = JSON.parse(this.response);
    callback(data.data)
  }
  // Send request
  request.send({"email":email});
}


// Update company details
function getStockObj(callback){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()
  let company = document.getElementById('company-name').innerHTML.trim();
  //getting user object
  request.open('GET', `http://localhost:5000/company/${company}`, true)

  request.onload = function () {
    var data = JSON.parse(this.response);
    console.log(data);

    if(data.status == 'success')
     displayData(data.data)
    else
     displayError(data.message)

    callback(data)
  }
  // Send request
  request.send();
}

// Check if current company is fav
function checkFav(){
  getStockObj(function(stockobj){
    getUserObj(function(userobj){
      let button = document.getElementById('btn')
      let current = stockobj.data.code
      for(fav of userobj.fav)
       {
        if(fav == current)
          {
            button.textContent = 'Remove from Favorites'
            button.addEventListener('click',function(){
              changeFav({
                code : current,
                action : 'remove'
              })
            })
            return
          }
       }
       button.textContent = 'Add to Favorites'
       button.addEventListener('click',function(){
         changeFav({
           code : current,
           action : 'add'
         })
       })
    })
  })
}
checkFav()

//using buy form
function buy(){
  console.log('buy');
  var hidden_elements = document.getElementsByClassName('buy-form')
  for (var i = 0; i < hidden_elements.length; i++) {
   hidden_elements.item(i).style.visibility = 'visible';
}
}
document.getElementById('buy-button').addEventListener('click',buy)


//sending a request
function sendRequest(requestObj){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()

  request.open('POST', `http://localhost:5000/buy/`, true)
  request.setRequestHeader('content-type','application/json')

  request.onload = function () {
    var data = JSON.parse(this.response);
    console.log(data);
  }
  // Send request
  request.send(JSON.stringify(requestObj));
}

//parsing and sending request
function parseObj(){
  let requestobj = {
    email :   document.getElementById('email').innerHTML.trim(),
    company : document.getElementById('company-name').innerHTML.trim(),
    stake :   parseFloat(document.getElementById('stake-input').value)
  }
  sendRequest(requestobj)
}
document.getElementById('confirm-button').addEventListener('click',parseObj)

//redirecting
function browseRedirect(){  window.location.href = browseLink;}
function holdingRedirect(){ window.location.href = holdingLink;}
function favRedirect(){     window.location.href = favLink;}

const browseLink = 'http://localhost:5000/browse'
const holdingLink = 'http://localhost:5000/profile/holdings'
const favLink = 'http://localhost:5000/profile/favs'

//redirect on click
document.getElementById('browse').addEventListener('click',browseRedirect)
document.getElementById('holdings').addEventListener('click',holdingRedirect)
document.getElementById('fav').addEventListener('click',favRedirect)
