// Display company information
function displayData(data){
  document.getElementById('name').innerHTML = data.name;
  document.getElementById('code').innerHTML = data.code;
  document.getElementById('stake').innerHTML = data.stk;
  document.getElementById('value').innerHTML = data.val;
}

//Notify user on fav
function notifyFav(flag,callback){
  let company_card = document.getElementById('name').parentNode

  //add break
  let br = document.createElement('br')
  company_card.appendChild(br)

  //Configuring the button
  let button = document.createElement('button')
  button.id = 'btn'
  if(flag == 1)
   {
     button.innerHTML = 'Remove from Favorites'
   }
  else
   {
     button.innerHTML = 'Add to Favorites'
   }

  company_card.appendChild(button)
  callback(button)
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
  }
  console.log('request',JSON.stringify(requestObj));
  // Send request
  request.send(JSON.stringify(requestObj));
}

//Check from list of user favorites
function checkFav(favs){
  let current = document.getElementById('code').innerHTML.trim()
  let email = document.getElementById('email').innerHTML.trim()

  let favObj = {
    'email' : email,
    'fav' : current
  }

  for(var i = 0;i<favs.length;i++){
    if(current == favs[i])
     {
       favObj['type'] = 'remove'
       notifyFav(1,(button)=>{
           button.addEventListener('click',function(){
           sendFavRequest(favObj)
           console.log('parsed',favObj);
         })
       })
       return
     }
  }

  notifyFav(0,(button)=>{
    favObj['type'] = 'add'
    button.addEventListener('click',function(){
    sendFavRequest(favObj)
    console.log('parsed',favObj);
      })
    })
}

//get user details to check favorite status
function getUserObj(){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()
  let email = document.getElementById('email').innerHTML.trim();
  //getting user object
  request.open('GET', `http://localhost:5000/user/${email}`, true)

  request.onload = function () {
    var data = JSON.parse(this.response);
    checkFav(data.data.fav)
  }
  // Send request
  request.send({"email":email});
}
getUserObj();

// Update company details
function getStockObj(){
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
  }
  // Send request
  request.send();
}
getStockObj();

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
    email : document.getElementById('email').innerHTML.trim(),
    company : document.getElementById('company-name').innerHTML.trim(),
    stake : document.getElementById('stake-input').value
  }
  sendRequest(requestobj)
}
document.getElementById('confirm-button').addEventListener('click',parseObj)

//redirecting
function browseRedirect(){
  window.location.href = browseLink;
}

function holdingRedirect(){
  window.location.href = holdingLink;
}

function favRedirect(){
  window.location.href = favLink;
}

const browseLink = 'http://localhost:5000/browse'
const holdingLink = 'http://localhost:5000/profile/holdings'
const favLink = 'http://localhost:5000/profile/favs'

//redirect on click
document.getElementById('browse').addEventListener('click',browseRedirect)
document.getElementById('holdings').addEventListener('click',holdingRedirect)
document.getElementById('fav').addEventListener('click',favRedirect)
