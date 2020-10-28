let profileUrl = `http://localhost:5000/profile`

function profileClick(){
  window.location.replace(profileUrl)
}
document.getElementById('profileClick').addEventListener('click',profileClick)

//setting the favorites
function setFavs(favs){
  let fav_container = document.getElementById('fav-container')
  for(fav of favs)
  {
    //setting the fav element
    let fav_element = document.createElement('div')
    fav_element.innerHTML = fav

    // appending the fav_element to the fav-container
    fav_container.appendChild(fav_element)
  }
}

//update funds
function getObj(){
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
getObj();
