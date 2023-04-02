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
})


fetch(`https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=f6302d4de9dd9a1785f80b5cb10cfdfc`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });}


button.addEventListener('click', coordinates);
