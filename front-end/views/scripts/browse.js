//link for profile
let profileUrl = `http://localhost:5000/profile`

//profile page
function profileClick(){window.location.href = profileUrl}
document.getElementById('profileClick').addEventListener('click',profileClick)

//company page
function showFull(){window.location.href = `http://localhost:5000/browse/${this.id}`}

function display(data){
  if(data.status == 'fail' || data.status == 'error')
   {
      return document.getElementById('error-message').visibility = visible
   }

   let stocks = document.getElementById('stocks')

   for(company of data.data){
     // Company card
     let company_card = document.createElement('div')
     company_card.id = company.code
     company_card.addEventListener('click',showFull)

     let company_name = document.createElement('div');
     company_name.innerHTML = company.name;

     let company_code = document.createElement('div');
     company_code.innerHTML = company.code;

     let company_growth = document.createElement('div');
     company_growth.innerHTML = (company.value-company.initial)/company.initial * 0.01;

     let br = document.createElement('br')

     company_card.appendChild(company_name)
     company_card.appendChild(company_code)
     company_card.appendChild(company_growth)
     company_card.appendChild(br)
     stocks.appendChild(company_card)
   }

}

//updating stock objects
function getObj(){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()
  //getting user object
  request.open('GET', `http://localhost:5000/all`, true)

  request.onload = function () {
    var data = JSON.parse(this.response);
    display(data);
  }
  // Send request
  request.send();
}
getObj();
