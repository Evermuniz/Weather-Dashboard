var apiURL = "https://api.openweathermap.org";
var apiKey = "f6302d4de9dd9a1785f80b5cb10cfdfc";
var button = document.querySelector("#submission");
var input = document.querySelector('#city');
var main = document.querySelector("#main");
var forecast = document.querySelector("#forecast");
var title = document.querySelector("#current");
var icon = document.querySelector("#icon");
var fiveDayContainer = document.querySelector("#fiveDay");
var date = dayjs().format("M/D/YYYY");
var saved = document.querySelector("#history");
var fiveDay = document.querySelector("#fiveDayText");
var searched = [];

function displayHistory() {
  var list = localStorage.getItem("city");
  if (list) {
    searched = JSON.parse(list);
  }

  for (var i = 0; i < searched.length; i++) {
    var items = document.createElement("button");
    items.textContent = searched[i];
    saved.append(items);
    items.setAttribute("class", "btn btn-sm btn-secondary m-1");
    items.addEventListener("click", function () {
      var city = this.textContent;
      coordinates(city);
    });
  }
}

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
  history(city);
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
 main.innerHTML='';
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
  icon.setAttribute("class", "img");
  icon.setAttribute("alt", description);
  container.setAttribute("class", "p-3");
  title.textContent = city + " " + "(" + todaysDate + ")";
  tempData.textContent = "Temperature: " + temp + "°F";
  windData.textContent = "Wind Speed: " + wind + " MPH";
  humidityData.textContent = "Humidity: " + humidity + " %";
  main.appendChild(container);
  container.append(tempData, windData, humidityData);
}

function fiveDayForecast(data) {
    fiveDayContainer.innerHTML='';
  fiveDay.textContent = "5-Day Forecast: ";
  for (var i = 1; i < 6; i++) {
    var image = "https://openweathermap.org/img/wn/" + data[i].weather[0].icon + ".png";
    var description = data[i].weather[0].description;
    var temp = data[i].main.temp;
    var wind = data[i].wind.speed;
    var humidity = data[i].main.humidity;
    var future = dayjs().add(i, "day").format("M/D/YYYY");

    var card = document.createElement("div");
    var fiveIcon = document.createElement("img");
    var dateText = document.createElement("h5");
    var tempData = document.createElement("p");
    var windData = document.createElement("p");
    var humidityData = document.createElement("p");

    dateText.textContent = future;
    card.setAttribute("class", "card col-2 m-2 bg-primary text-white");
    fiveIcon.setAttribute("src", image);
    fiveIcon.setAttribute("class", "img");
    fiveIcon.setAttribute("alt", description);
    tempData.textContent = "Temp: " + temp + "°F";
    windData.textContent = "Wind: " + wind + " MPH";
    humidityData.textContent = "Humidity: " + humidity + " %";

    fiveDayContainer.appendChild(card);
    card.append(dateText, fiveIcon, tempData, windData, humidityData);
  }
}

function history(city) {
  searched.push(city);
  localStorage.setItem("city", JSON.stringify(searched));
  saved.innerHTML='';
  displayHistory();
}

button.addEventListener("click", getWeather);
displayHistory();
