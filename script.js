var apiURL = "https://api.openweathermap.org";
var apiKey = "f6302d4de9dd9a1785f80b5cb10cfdfc";
var button = document.querySelector("#submission")

function coordinates (search) {
   var coord = `${apiURL}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`; 
    fetch (coord)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
    console.log(data);
    weather(data[0]);
})}


function weather (location) {
  var lat = location.lat;
  var lon = location.lon;
  var city = location.name;

  var weatherAPI = apiURL + '/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;
  fetch(weatherAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function getWeather() {
    var search = document.querySelector("#city").value;
    coordinates(search);
}


button.addEventListener('click', getWeather);