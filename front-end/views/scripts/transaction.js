function setTransaction(transactions){
  let container = document.getElementById('transaction-container')

  let proxy_container = document.createElement('div')
  proxy_container.id = 'proxy-container'
  container.appendChild(proxy_container)

  for(transaction of transactions){
    let tra_card = document.createElement('div')

    let company = document.createElement('div')
    company.innerHTML = transaction.company

    let date = document.createElement('div')
    date.innerHTML = transaction.date

    let profit = document.createElement('div')
    profit.innerHTML = transaction.profit

    let stake = document.createElement('div')
    stake.innerHTML = transaction.stake

    tra_card.appendChild(company)
    tra_card.appendChild(date)
    tra_card.appendChild(profit)
    tra_card.appendChild(stake)
    tra_card.appendChild(document.createElement('br'))

    proxy_container.appendChild(tra_card)
  }
}

// Set user data
function display(data){
  console.log(data);
  setTransaction(data.transaction)
  if(data.fav != null && data.fav.length >0)
   setSortBar(data.fav[0])
}


//set sort bar
function setSortBar(obj){
  console.log(obj);
}

//sort based on given property
function sortByProperty(property){
    return function(a,b){
      try{
        if(a[prop]>b[prop])
         {return 1}
        else if(a[prop]<b[prop])
         {return -1}
      }catch(e){}
      return 0
    }
}


//getUserObj
function getObj(){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()
  let email = document.getElementById('email').innerHTML.trim();
  //getting user object
  request.open('GET', `http://localhost:5000/user/${email}`, true)

  request.onload = function () {
    var data = JSON.parse(this.response);
     if(data.status == 'success')
      display(data.data)
     else{ //Display error message
       document.getElementById('user-data-error').innerHTML = data.message
     }
  }
  // Send request
  request.send({"email":email});
}
getObj();
