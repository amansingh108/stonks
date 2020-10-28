let profileUrl = `http://localhost:5000/profile`

function profileClick(){
  window.location.href = profileUrl
}
document.getElementById('profileClick').addEventListener('click',profileClick)


function showFull(){
  window.location.href = `http://localhost:5000/browse/${this.id}`
}

function display(data){
  let stocks = document.getElementById('stocks')

  //for every element of response create a stock-card
  for(code of data.data) //nested data
  {
    //create a stock-card
    let stock_div = document.createElement('div')
    stock_div.className = 'stock-card'
      //set the stock-code for header
      let stock_code = document.createElement('div')
      stock_code.className = 'stock-code'
      stock_code.innerHTML = code
    stock_div.appendChild(stock_code)
    stock_div.id = code
    stock_div.addEventListener('click',showFull)

    let btn = document.createElement('div')
    btn.innerHTML = 'button'
    stock_div.appendChild(btn)


    stocks.appendChild(stock_div)
  }
}

//update funds
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
