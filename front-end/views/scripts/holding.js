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


function parseRequest(holding_obj,sellingStake)
{
    let request = {
      'email' : document.getElementById('email').innerHTML.trim(),
      'sellingStake' : sellingStake,
      'holding' : holding_obj
    }

    console.log('request parsed',request)
    sendRequest(request)
}

//set the holding on page
function setHoldings(holdings){
  let holding_container = document.getElementById('card-container')

   //create holding object from holdings
   for(holding of holdings)
   {
     let holding_obj = {}
     holding_obj.name = holding.name
     holding_obj.stake = parseFloat(holding.stake)
     holding_obj.price = parseFloat(holding.price)
     holding_obj.date = holding.date

     // console.log(holding);
     let holding_card = document.createElement('div')
     holding_card.className = 'card'
     holding_card.className = 'holding'


     let code = document.createElement('div')
     code.className = 'info-text code'
     code.innerHTML = holding.name



     let stake = document.createElement('div')
     stake.className = 'info-text stake'
     stake.innerHTML = holding.stake


     let price = document.createElement('div')
     price.className = 'info-text price'
     price.innerHTML = holding.price


     let date = document.createElement('div')
     date.className = 'info-text date'
     date.innerHTML = holding.date


     holding_card.appendChild(code)
     holding_card.appendChild(stake)
     holding_card.appendChild(price)
     holding_card.appendChild(date)

     //create a hidden form for selling
     var form = document.createElement('form');

     //stake input
     var stake_input = document.createElement("input");
     stake_input.setAttribute("type", "number");
     stake_input.setAttribute("min",'0');
     stake_input.setAttribute("max",holding.stake)
     stake_input.setAttribute("step",'any');
     stake_input.setAttribute("placeholder",'Enter Stake % to be sold')


     //error hidden div
     var error_message = document.createElement('div')
     error_message.class = 'hidden error-message'


     //stake button
     var button = document.createElement("div")
     button.innerHTML = 'Confirm'
     button.addEventListener('click',function(e){

       //Getting the input selling stake % from here
       let input_sellingStake = e.target.previousSibling.previousSibling.value

       //proceed for parsing the request structure
       parseRequest(holding_obj,parseFloat(input_sellingStake))
     })

     form.appendChild(stake_input)
     form.appendChild(error_message)
     form.appendChild(button)

     //add form to holding_card
     holding_card.appendChild(form)

     //for visual clarity
     let br = document.createElement('br')
     holding_card.appendChild(br)



     holding_container.appendChild(holding_card)

   }
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
