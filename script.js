var apiURL = "https://api.openweathermap.org";
var apiKey = "f6302d4de9dd9a1785f80b5cb10cfdfc";
var button = document.querySelector("#submission");
var main = document.querySelector("#main");
var title = document.querySelector("#current");
var icon = document.querySelector("#icon");
var fiveDayContainer = document.querySelector("#fiveDay");
var date = dayjs().format('M/D/YYYY');

function coordinates(search) {
  var coord = apiURL + "/geo/1.0/direct?q=" + search + "&limit=5&appid=" + apiKey;
  fetch(coord)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      weather(data[0]);
    });
}

function weather(search) {
  var lat = search.lat;
  var lon = search.lon;
  var city = search.name;

  var weatherAPI = apiURL + "/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
  fetch(weatherAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      items(city, data);
      console.log(data);
    });
}

function getWeather() {
  var search = document.querySelector("#city").value;
  coordinates(search);
}

function items(city, data) {
  displayWeather(city, data.list[0]);
  fiveDayForecast(data.list);
}

function displayWeather(city, data) {
  var image = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
  var description = data.weather[0].description;
  var temp = data.main.temp;
  var wind = data.wind.speed;
  var humidity = data.main.humidity;
  var todaysDate = dayjs(data.weather[0].dt_text).format("M/D/YYYY");

  var container = document.createElement("div");
  var tempData = document.createElement("p");
  var windData = document.createElement("p");
  var humidityData = document.createElement("p");

  icon.setAttribute("src", image);
  icon.setAttribute("class", "image");
  icon.setAttribute("alt", description);
  title.textContent = city + " " + todaysDate;
  tempData.textContent = "Temperature: " + temp + "°F";
  windData.textContent = "Wind Speed: " + wind + " MPH";
  humidityData.textContent = "Humidity " + humidity + " %";

  main.appendChild(container);
  container.append(tempData, windData, humidityData);
}

function fiveDayForecast(data) {
  for (var i = 1; i < 6; i++) {

   // var image = "https://openweathermap.org/img/wn/" + data.weather[i].icon + ".png";
    //   var description = data[i].weather[0].description;
    var temp = data[i].main.temp;
    var wind = data[i].wind.speed;
    var humidity = data[i].main.humidity;
    var future = dayjs().add(i, 'day').format('M/D/YYYY');

    var card = document.createElement("div");
    var dateText = document.createElement("h4");
    var tempData = document.createElement("p");
    var windData = document.createElement("p");
    var humidityData = document.createElement("p");

    dateText.textContent = future;

    tempData.textContent = "Temperature: " + temp + "°F";
    windData.textContent = "Wind Speed: " + wind + " MPH";
    humidityData.textContent = "Humidity " + humidity + " %";

    fiveDayContainer.appendChild(card);
    card.append(dateText, tempData, windData, humidityData);
  }
}

button.addEventListener("click", getWeather);
