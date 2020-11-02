function showFund(){
  document.getElementById('fund-container').style.display = 'inline'
  document.getElementById('fund-button').style.display = 'none'
}

function hideFund(){
  document.getElementById('fund-container').style.display = 'none'
  document.getElementById('fund-button').style.display = 'inline'
}

//get user obj
function getObj(){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()
  let email = document.getElementById('email').innerHTML.trim();
  //getting user object
  request.open('GET', `http://localhost:5000/user/${email}`, true)

  request.onload = function () {
    var data = JSON.parse(this.response);
    document.getElementById('funds').innerHTML = data.data.funds;
  }
  // Send request
  request.send({"email":email});
}


function browseRedirect(){window.location.href = browseLink}
function holdingRedirect(){window.location.href = holdingLink }
function favRedirect(){window.location.href = favLink}
function transactionRedirect(){window.location.href = transactionLink}

const browseLink = 'http://localhost:5000/browse'
const holdingLink = 'http://localhost:5000/profile/holdings'
const favLink = 'http://localhost:5000/profile/favs'
const transactionLink = 'http://localhost:5000/profile/transactions'

//redirect on click
document.getElementById('browse').addEventListener('click',browseRedirect)
document.getElementById('holdings').addEventListener('click',holdingRedirect)
document.getElementById('fav').addEventListener('click',favRedirect)
document.getElementById('transactions').addEventListener('click',transactionRedirect)

window.onload = function(){
  getObj()
  hideFund()
}
