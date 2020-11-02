function showFund(){
  document.getElementById('fund-container').style.display = 'inline'
  document.getElementById('fund-button').style.display = 'none'
}

function hideFund(){
  document.getElementById('fund-container').style.display = 'none'
  document.getElementById('fund-button').style.display = 'inline'
}

// url to profile
let profileUrl = `http://localhost:5000/profile`

//redirecting to profile
function profileClick(){ window.location.replace(profileUrl) }
document.getElementById('profileClick').addEventListener('click',profileClick)


//parsing request
function parseRequest(favString){
  let email = document.getElementById('email').innerHTML.trim();
  let request = {
    'email' : email,
    'code' : favString,
    'action' : 'remove'
  }

  sendFavRequest(request)
}

//send fav request
function sendFavRequest(requestObj){

  //create request
  var request = new XMLHttpRequest()

  //getting user object
  request.open('POST', `http://localhost:5000/fav`, true)
  request.setRequestHeader('content-type','application/json')

  console.log('request',JSON.stringify(requestObj));
  // Send request
  request.send(JSON.stringify(requestObj));
}

//company page
function showFull(code){window.location.href = `http://localhost:5000/browse/${code}`}


//setting the favorites
function setFavs(favs){
  console.log(favs);
  let fav_container = document.getElementById('fav-container')
  for(fav of favs)
  {
    //fav card
    let fav_card = document.createElement('div')
    fav_card.id = fav

    //setting the fav element
    let fav_element = document.createElement('div')
    fav_element.innerHTML = fav
    fav_card.appendChild(fav_element)

    //get and set fav stock obj and remove button at the end
    getStockObj(fav,function(company){
      if(company.status != 'success')
       return
      company = company.data
      console.log(company);


      fav_element.addEventListener('click',function(e){
        showFull(e.target.parentNode.id)
      })

      //setting the remove button
      let removeButton = document.createElement('button')
      removeButton.textContent = 'Remove'
      removeButton.addEventListener('click',function(e){
        parseRequest(e.target.parentNode.id)
        e.target.parentNode.remove()
      })
      fav_card.appendChild(removeButton)

      let company_growth = document.createElement('div');
      company_growth.innerHTML = (company.val-company.initial)/company.initial * 0.01;

      let company_value = document.createElement('div');
      company_value.innerHTML = company.val

      fav_card.appendChild(company_growth)
      fav_card.appendChild(company_value)
  })

    // appending the fav_element to the fav-container
    fav_container.appendChild(fav_card)
  }
}

//update favorites
function getUserObj(){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()
  let email = document.getElementById('email').innerHTML.trim();
  //getting user object
  request.open('GET', `http://localhost:5000/user/${email}`, true)

  request.onload = function () {
    var res = JSON.parse(this.response);
    if(res.data.fav.length == 0)
     return document.getElementById('empty-msg').innerHTML = "No Favorites Selected"
    setFavs(res.data.fav);
  }
  // Send request
  request.send();
}
getUserObj();


// Update company details
function getStockObj(company_code,callback){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()

  //getting company stock object
  request.open('GET', `http://localhost:5000/company/${company_code}`, true)

  request.onload = function () {
    var data = JSON.parse(this.response);
    callback(data)
  }
  // Send request
  request.send();
}
