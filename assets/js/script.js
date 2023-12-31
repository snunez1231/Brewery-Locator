var temp = document.getElementById('temperature0');
var cityname = document.getElementById('city0');
var searchform = document.querySelector('.search');
var cityinput = document.getElementById('cityInput');
var brewerycontainer = document.getElementById('brewery-container');
var apiKey = "fcdb77bcab0f5e656f374a185e3665bd";
var humidityElement = document.getElementById('humidity0')
var windElement = document.getElementById ('wind0')

function getWeather(lat,lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
      .then(response => response.json())
      .then(data=> displayWeather(data))
      .catch(error => console.error("Error fetching weather API:", error));
}
function getCoordinates(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        var lat = data[0].lat;
        var lon = data[0].lon;

        localStorage.setItem('lastCity', city);
        localStorage.setItem('lastLat', lat);
        localStorage.setItem('lastLon', lon);

        getWeather(lat, lon); 
        getBrewery(city);
  
        
      });
  }

function getBrewery(city) {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${city}&per_page=3`)
    .then(response => response.json())
    .then(data => {
        console.log("Brewery API Response:", data);
        displayBrewery(data);
    })
    .catch(error => console.error("Error fetching brewery API:", error));
}

function displayWeather(data){
    console.log(data)
    cityname.textContent=data.name
    temp.textContent = `${Math.round(data.main.temp)}°F`;
    humidityElement.textContent= `${data.main.humidity}%`
    windElement.textContent= `${data.wind.speed}mph`

    var iconCode= data.weather[0].icon;
    var iconImg= document.createElement('img');
    iconImg.src = `https://openweathermap.org/img/w/${iconCode}.png`;
    iconImg.classList.add('large-icon');
    temp.appendChild(iconImg);

    var windIcon= document.getElementById('wind-icon');
    windIcon.scr= "assets/images/wind.png"
}

function displayBrewery(breweryData) {
    brewerycontainer.innerHTML = "";

    var tileContainer = document.createElement('div');
    tileContainer.classList.add('tile');

    breweryData.forEach(brewery => {
        var breweryTile = document.createElement('article');
        breweryTile.classList.add('tile', 'is-child', 'notification', 'is-primary');

        var breweryName = document.createElement('p');
        breweryName.classList.add('title');
        breweryName.textContent = brewery.name || "Name not available";

        var breweryAddress = document.createElement('p');
        breweryAddress.classList.add('subtitle');
        breweryAddress.textContent = `Address: ${brewery.address_1 || "Address not available"}, ${brewery.city || "City not available"}, ${brewery.state || "State not available"}, ${brewery.postal_code || "Postal Code not available"}`;
       
        var breweryPhone= document.createElement('p');
        breweryPhone.classList.add('subtitle');
        breweryPhone.textContent= `Phone number: ${brewery.phone || "Phone number not available"},`
  

        breweryTile.appendChild(breweryName);
        breweryTile.appendChild(breweryAddress);
        breweryTile.appendChild(breweryPhone)
        tileContainer.appendChild(breweryTile);
    });

    brewerycontainer.appendChild(tileContainer);
}

searchform.addEventListener("submit", (event) =>{
    event.preventDefault()
    console.log(cityinput.value)

  var inputCity= cityinput.value
  localStorage.setItem('lastCity', inputCity);

getCoordinates(cityinput.value)
getBrewery(cityinput.value)
} )

function checkLastCity() {
  var lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
      cityinput.value = lastCity;
      getCoordinates(lastCity);
      getBrewery(lastCity);
  }
}


