//link to profile
let profileUrl = `http://localhost:5000/profile`

function profileClick(){
  window.location.replace(profileUrl)
}
document.getElementById('profileClick').addEventListener('click',profileClick)

//empty message
function noHoldings(){
  document.getElementById('empty-msg').innerHTML = 'No Holdings'
}

function sendRequest(requestObj){
  requestObj.email = document.getElementById('email').innerHTML.trim()
  console.log(requestObj);


  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()
  //getting user object
  request.open('POST', `http://localhost:5000/sell`, true)
  request.setRequestHeader('content-type','application/json')

  request.onload = function () {
    var data = JSON.parse(this.response);
    console.log(data);
  }

  // Send request
  request.send(JSON.stringify(requestObj));
}

//confirm
function parseRequest(){
    //validate stake
    // name = this.id.split('-')[0]
    //
    // let holding_stake = document.getElementById(`${name}-stake`).innerHTML
    // let holding = {
    //   'name' : name,
    //   'stake' : holding_stake,
    //   'price' : document.getElementById(`${name}-price`).innerHTML.parseFloat(),
    //   'date' : document.getElementById(`${name}-date`).innerHTML
    // }
    // let error_message = document.getElementById(`${name}-message`)
    // let sellingStake = document.getElementById(`${name}-sellingStake`).value
    // console.log(sellingStake);
    console.log(this.id);
}

function f(){
  console.log(this.id);
}


//set the holding on page
function setHoldings(holdings){
 console.log(holdings);
}


//update holdings
function getObj(){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()
  let email = document.getElementById('email').innerHTML.trim();
  //getting user object
  request.open('GET', `http://localhost:5000/user/${email}`, true)

  request.onload = function () {
    var data = JSON.parse(this.response);
    if(data.data.holding.length == 0)
     return noHoldings()
    setHoldings(data.data.holding)
  }
  // Send request
  request.send({"email":email});
}
getObj();
