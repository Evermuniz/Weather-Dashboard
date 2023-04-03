var button = document.querySelector("#submission"); //variable for search button
var input = document.querySelector("#city"); //variable for the input field
var main = document.querySelector("#main"); //variable for the forecast elements container
var title = document.querySelector("#current"); //variable to assign title for the current forecast
var icon = document.querySelector("#icon"); //variable for image element in current forecast
var fiveDayContainer = document.querySelector("#fiveDay"); //container for the five day forecast
var date = dayjs().format("M/D/YYYY"); //today's date used in the forecast display, formatted using dayjs
var saved = document.querySelector("#history"); //container for the history buttons to append to
var fiveDay = document.querySelector("#fiveDayText"); //container for the five day forecast text to appear outside of the cards
var searched = []; //array for the search history, updated with values from local storage and user search

function displayHistory() {
  //this function will display the search history and create buttons
  var list = localStorage.getItem("city"); //grabbing values saved in local storage
  if (list) {
    //if local storage is not empty then parse the data
    searched = JSON.parse(list);
  }

  for (var i = 0; i < searched.length; i++) {
    //for loop to repeat for as many cities saved in the searched array
    var items = document.createElement("button"); //create button
    items.textContent = searched[i]; //assign text per item in the array
    saved.append(items); //append the buttons to the saved container
    items.setAttribute("class", "btn btn-sm btn-secondary m-1"); //bootstrap classes for sizing and design
    items.addEventListener("click", function () {
      //adding event listener to each button
      var city = this.textContent; //creating a new variable using the city name in each button as the value
      coordinates(city); //if the button is clicked then pass the city name as a parameter in the coordinates function
    });
  }
};

function getWeather() {
  //the first function triggered when a user searches for a city
  var search = document.querySelector("#city").value; //the user input is used to create a new variable
  coordinates(search); //the search variable is passed to the coordinates function as a parameter
  input.value = ""; //clear text from the search box
};

function coordinates(search) {
  //this function will return the coordinates for the selected city. The parameter comes from getWeather function or displayHistory
  var coord =
    "https://api.openweathermap.org/geo/1.0/direct?q=" + search + "&limit=5&appid=f6302d4de9dd9a1785f80b5cb10cfdfc"; //using the search parameter (city name) to construct the API URL to retrieve city coordinates
  fetch(coord) //making a fetch call using the URL built above
    .then(function (response) {
      //return the response in json format
      return response.json();
    })
    .then(function (data) {
      //here we can access the data
      console.log(data); //console the data for debugging and data structure reference
      weather(data[0]); //pass the first array from the data as a parameter to the weather function
    });
};

function weather(search) {
  //using the data returned in the first array as a parameter from the coordinates function, this function will return the forecast
  var lat = search.lat; //grabbing lat value and assigning to variable
  var lon = search.lon; //grabbing lon value and assigning to variable
  var city = search.name; //grabbing city name and assigning to variable

  var weatherAPI =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=f6302d4de9dd9a1785f80b5cb10cfdfc"; //using the lat & long values to construct the API URL to retrieve forecast
  fetch(weatherAPI) //making a fetch call using the URL built above
    .then(function (response) {
      //return the response in json format
      return response.json();
    })
    .then(function (data) {
      //here we can access the data
      displayWeather(city, data.list[0]); //pass the city name and data retrieved in this API call to the displayWeather function, array [0] for today's forecast
      fiveDayForecast(data.list); //pass the data list to the fiveDayForecast function
      console.log(data); //console log the data for debuggin and structure reference
    });
  history(city); //run the history function to add the city to the saved list
};

function displayWeather(city, data) {
  //using data from the weather function as parameters, this function will display today's weather
  main.innerHTML = ""; //begin by resetting content to avoid adding new content on top of each other
  var image = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"; //create a URL using the weather icon code in the returned API call data to display weather icon
  var description = data.weather[0].description; //teh description will be used to update the image alt text
  var temp = data.main.temp; //temp variable assigned the temp value from the API data
  var wind = data.wind.speed; //wind variable assigned the wind speed value from the API data
  var humidity = data.main.humidity; //humidity variabe assigned the humidity value form the API data

  var container = document.createElement("div"); //create new div element
  var tempData = document.createElement("p"); //create new p element for temp
  var windData = document.createElement("p"); //create new p element for wind
  var humidityData = document.createElement("p"); //create new element for humidity

  icon.setAttribute("src", image); //add source link to the icon variable that selects the img element in HTML, the link will display the weather icon
  icon.setAttribute("class", "img"); //add a class to the image, the class properties are defined in the css file
  icon.setAttribute("alt", description); //set the icon description from the API data as the alt text for accessiibility
  container.setAttribute("class", "p-3"); //add class to the container, uses bootstrap to add padding
  title.textContent = city + " " + "(" + date + ")"; //the title variable is given text using the city name and global date variable
  tempData.textContent = "Temperature: " + temp + "°F"; //use the temp value from the API data to add text content to the newly created tempData element
  windData.textContent = "Wind Speed: " + wind + " MPH"; //use the wind value from the API data to add text content to the newly created windData element
  humidityData.textContent = "Humidity: " + humidity + " %"; ////use the humidity value from the API data to add text content to the newly created humidityData element
  main.appendChild(container); //append the container to the main container
  container.append(tempData, windData, humidityData); //append the individual p elements to the container
};

function fiveDayForecast(data) {
  //this function will render the future five day forecast for a given city, the parameter used is from the weather function
  fiveDayContainer.innerHTML = ""; //reset content to avoid adding new content on top of each other
  fiveDay.textContent = "5-Day Forecast: "; //add text to the fiveDay container
  for (var i = 1; i < 6; i++) {
    //since the forecast data is in an array with [0] being today, we will repeat this loop for the future five days not including today
    var image = "https://openweathermap.org/img/wn/" + data[i].weather[0].icon + ".png"; //similar to above but we are using the i variable to move through the array to get the weather icon URL
    var description = data[i].weather[0].description; //also using the i variable to move through the array and get the desctiption
    var temp = data[i].main.temp; //moving through the array to get each day's temp
    var wind = data[i].wind.speed; //moving through the array to get each day's wind speed
    var humidity = data[i].main.humidity; //moving through the array to get each day's humidity
    var future = dayjs().add(i, "day").format("M/D/YYYY"); //I couldn't get the date data to render correctly for each day, using date global variable and adding the array number value then formatting using dayjs

    var card = document.createElement("div"); //create a new card div
    var fiveIcon = document.createElement("img"); //create a new image element, in the displayWeather function I assigned the URL to an existing elemenent, just trying out different methods
    var dateText = document.createElement("h6"); //create new h6 element for date
    var tempData = document.createElement("p"); //create new p element temp
    var windData = document.createElement("p"); //create new p element for wind
    var humidityData = document.createElement("p"); //create new p element for humidity

    dateText.textContent = future; //assigning date value to the newly created dateText element
    card.setAttribute("class", "card col-2 m-2 bg-primary text-white font-size"); //adding classes to the cards using bootstrap for positioning and color
    fiveIcon.setAttribute("src", image); //setting the img URL to be the respective weather icon
    fiveIcon.setAttribute("class", "img"); //adding class defined in css file to the image
    fiveIcon.setAttribute("alt", description); //adding weather icon description as alt text for accessibility
    tempData.textContent = "Temp: " + temp + "°F"; //assigning value to the tempData element
    windData.textContent = "Wind: " + wind + " MPH"; //assigning value to the windData element
    humidityData.textContent = "Humidity: " + humidity + " %"; //assigning value to the humidityData element

    fiveDayContainer.appendChild(card); //append the card to the container
    card.append(dateText, fiveIcon, tempData, windData, humidityData); //append each created element to the card
  }
};

function history(city) {
  //this function will update the saved search history, the parameter used is passed from weather function
  if (!searched.includes(city)) {
    //if the searched array doesn't contain the city name then perform the function
    searched.push(city); //add the city to the searched array
    localStorage.setItem("city", JSON.stringify(searched));
  } //add the searched array to local storage in json.stringify format
  saved.innerHTML = ""; //clear the list container so the values don't get added on top of each other every time the function runs
  displayHistory(); //run the displayHistory function
};

button.addEventListener('click', getWeather); //add event listener to the search button and trigger the getWeather function
displayHistory(); //run the display history to show history without searching for a city
