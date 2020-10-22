// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest()


// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://localhost:3000/all', true)


request.onload = function () {
  var data = JSON.parse(this.response);
}
// Send request
request.send();
