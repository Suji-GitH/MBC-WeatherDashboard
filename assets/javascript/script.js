//jquery variables
var $searchControl = $("#searchControl");
var $searchHistory = $("#searchHistory");
var $searchButton = $("button"); 
var $forecastBtn = $("#forecastBtn");
var $forecastBody = $("#forecastBody")
var $location = $("#location");
var $date = $("#date");
var $weatherIcon = $("#weatherIcon");
var $temperature = $("#temperature");
var $humidity = $("#humidity");
var $windSpeed = $("#windSpeed");
var $uvIndex = $("#uvIndex");
var $weatherIcon5 = $(".mr-3");
var $date5 = $(".date5");
var $temperature5 = $(".temperature5");
var $humidity5 = $(".humidity5");

//City
var city = "";

//Local Storage - Search History Obj
var searchedCity = [];

//Moment.js time
var currentMoment = moment(); 

//Initialize the Landing page to default
initialize();

//initialize the page with Searched city
function initialize() {

  //hide 5 day forecast
  $forecastBody.hide();

  //Get search history from local storage
  var storedCity = JSON.parse(localStorage.getItem("SearchedCity"));

  //If cities were retrieved from localStorage, update the recentlySearchedCitiesArray to it
  if (storedCity !== null) {
      searchedCity = storedCity;

    for (var i=0; i < searchedCity.length; i++) {

      var cityButton = $("<button>").attr("type", "button").addClass("btn btn-dark btn-block");

      $searchHistory.prepend(cityButton.html(searchedCity[i]));
    }

    //Get last city from Array
    city = searchedCity[searchedCity.length - 1];
    getCityWeather();

  } 
};

//Function to add/remove Item to Array
function pushSearchedCity() {

  if(searchedCity.length === 4){

    var firstArrayItem = searchedCity[0];

    $("button:contains(" + firstArrayItem + ")").remove();
    
    searchedCity.shift();

    searchedCity.push($searchControl.val().trim());

  } else

    searchedCity.push($searchControl.val().trim());
};

//Function to save Item in local Storage
function storeLookupCity() {

  localStorage.setItem("SearchedCity", JSON.stringify(searchedCity));
};

//Event Listener for search bar
$searchControl.on("keypress", function(e){
  if(e.key === "Enter"){

    if ($searchControl.val() === ""){
      alert("You must enter a city name");
    } 
    else {

      city = $searchControl.val().trim();

      var cityButton = $("<button>").attr("type", "button").addClass("btn btn-dark btn-sm btn-block");

      $searchHistory.prepend(cityButton.html($searchControl.val().trim()));
      
      pushSearchedCity();
      storeLookupCity();
      getCityWeather();
    };

    $searchControl.val("");
  };
});

//Even Listener for appended city button
$(document).on("click", ".btn-block", function() {

  city = $(this).html();

  getCityWeather();
});

//Event Listener for 5 Day Forecast hide/show
$forecastBtn.on("click", function() {

$forecastBody.toggle();
});

//API call to Get weather details of the city
function getCityWeather() {

  //Put in apiKey here
  var apiKey = "89f2f90bb941f9ca5faa038d05d25bdb";

  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + apiKey + "&cnt=5";

  $.ajax({
    url: queryURL,
    method: "GET",
    error: function(){
      alert("Enter valid City Name");
      localStorage.clear;
      searchedCity = [];
      $searchHistory.empty();
    }
  }).then(function(weatherData) {

    //shorten form for accessing api object 
    var weatherDataList = weatherData.list[0];
    //Url for weather Icon
    var weatherIconUrl = ("https://openweathermap.org/img/wn/" + weatherDataList.weather[0].icon + "@2x.png");

    //Switch background to weather condition 
    switch (weatherDataList.weather[0].main) {
      case "Clear":
        document.body.style.backgroundImage = 'url("../Assignment-6/assets/img/Clear.jpg")';
        break;
      case "Clouds":
        document.body.style.backgroundImage = 'url("../Assignment-6/assets/img/Clouds.jpg")';
        break;
      case "Rain":
        document.body.style.backgroundImage = 'url("../Assignment-6/assets/img/Rain.jpg")';
        break;
      case "Drizzle":
        document.body.style.backgroundImage = 'url("../Assignment-6/assets/img/Drizzle.jpg")';
        break;
      case "Thunderstorm":
        document.body.style.backgroundImage = 'url("../Assignment-6/assets/img/Thunderstorm.jpg")';
        break;    
    };
    
    //Display main weather Stats
    $weatherIcon.attr("src", weatherIconUrl);
    $date.html((weatherDataList.dt_txt).substring(0,10));
    $location.html(weatherData.city.name);
    $temperature.html(weatherDataList.main.temp + "°C");
    $humidity.html(weatherDataList.main.humidity + "%");
    $windSpeed.html(weatherDataList.wind.speed + "m/s");

    //Lat and long from 
    var lat = weatherData.city.coord.lat;
    var lon = weatherData.city.coord.lon;

    //url for UV api
    var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;

    //api call get UV index
    $.ajax({
      url: uvQueryUrl,
      method: "Get"
    }).then(function(uvData){

      var uvRating = uvData.value;

      //Colour coding UV value
      if (uvRating < 5) {
        $uvIndex.html(uvRating).css("color", "green");
      } else if (uvRating >= 5 & uvRating <= 7) {
        $uvIndex.html(uvRating).css("color", "orange");
      } else if (uvRating > 7) {
        $uvIndex.html(uvRating).css("color", "red");
      }
    });

    //Display values for 5 day forecast
    for (var i=0; i < 5; i++) {

      var date5 = currentMoment.add(i, "days").format("dddd, MMM Do");
      var weatherDataList5 = weatherData.list[i];
      var weatherIconUrl5 = ("https://openweathermap.org/img/wn/" + weatherDataList5.weather[0].icon + "@2x.png");

      $weatherIcon5.eq(i).attr("src", weatherIconUrl5);
      $date5.eq(i).html(date5);
      $temperature5.eq(i).html(weatherDataList5.main.temp + "°C");
      $humidity5.eq(i).html(weatherDataList5.main.humidity + "%");
    };
  })
};


