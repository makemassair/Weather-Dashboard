const API = "1de5c8ed9f7d7f5f4ff02c6b0cafa457";
const today = moment().format('dddd, MMMM D, YYYY');
var weatherToday = $("#today");
var weatherForecast = $("#forecast");
var weatherHistory = $("#history");
let searchArray = []; // declare variable as empty array

// get city weather
function getCity(cityName) {
    var queryURL ="https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(data) {
        weatherToday.empty();
        var lat = data.city.coord.lat; // pulls in latitude
        var lon = data.city.coord.lon; // pulls in longitude
        var tempC = data.list[0].main.temp - 273.15; // converts Kelvin to Celsius
        var icon = data.list[0].weather[0].icon; // pulls icon code in
        var humidity = data.list[0].main.humidity; // pulls in humidity
        var windSpeed = data.list[0].wind.speed * 3.6; // pulls in wind speed (metre/sec) + converts to km/hr
        var iconImg = `https://openweathermap.org/img/wn/` + icon + `@2x.png`;
        
        weatherToday.append($("<img>").attr("src", iconImg).addClass("icon")) // prints weather icon
        
        // prints city name, adds today's date, puts in div class
        weatherToday.append($("<span>").text(data.city.name).append(today).addClass("currentCity"));
        weatherToday.append($("<span>").text("Temp: " + tempC.toFixed(2) + " °C").addClass("currentTemp"));
        weatherToday.append($("<span>").text("Wind : " + windSpeed.toFixed(2) + " km/h"));
        weatherToday.append($("<span>").text("Humidity: " + humidity + " %"));
        
        if (cityName !== "" && !searchArray.includes(cityName)) {
            searchArray.push(cityName);
            localStorage.setItem(`searches`, JSON.stringify(searchArray)); // puts the searched city into storage
            displaySearchHistory(searchArray);
        } 

        getForecast(lat, lon);

    }).fail(function() {
        console.log("request failure");
    });
};

// get 5 day forecast
function getForecast(lat, lon) {
    var queryURL5days = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API;

    $.ajax({
        url: queryURL5days,
        method: "GET"
    }).then(function(data) {        
        weatherForecast.empty();
        for (let i = 8; i < data.list.length; i++) {
            if (i % 8 === 0 || i === data.list.length - 1) {
                var date = moment().add(i, 'day');
                var tempC = data.list[i].main.temp - 273.15; // converts Kelvin to Celsius
                var icon = data.list[i].weather[0].icon; // pulls icon code in
                var iconTxt = data.list[i].weather[0].description // pulls in weather description
                var iconImg = `https://openweathermap.org/img/wn/` + icon + `@2x.png`; // adds icon code to url
                var humidity = data.list[i].main.humidity; // pulls in humidity
                var windSpeed = data.list[i].wind.speed * 3.6; // pulls in wind speed + converts to km/hr

                let forecastCard = $(`<div>`)
                .addClass("card forecastCard")

                let forecastDate = $(`<span>`)
                .addClass("forecastDate h4")
                .text(`${moment(data.list[i].dt_txt).format('dddd')}`)

                let forecastIcon = $("<img>")
                .attr("src", iconImg).attr("alt", iconTxt)
                .addClass("icon")

                let forecastTemp = $(`<span>`)
                .addClass("forecastTemp")
                .text("Temp: " + tempC.toFixed(2) + " °C").addClass("currentTemp")

                let forecastWind = $(`<span>`)
                .addClass("forecastWind")
                .text("Wind : " + windSpeed.toFixed(2) + " km/h")

                let forecastHumidity = $(`<span>`)
                .addClass("forecastHumidity")
                .text("Humidity: " + humidity + " %")

                // append HTML elements
                forecastCard.append(forecastDate);
                forecastCard.append(forecastIcon);
                forecastCard.append(forecastTemp);
                forecastCard.append(forecastWind);
                forecastCard.append(forecastHumidity);

                // append to HTML existing structre
                weatherForecast.append(forecastCard);
            }
        };
    });
}

// click event listener -> search button
$("#search-button").click(function(e) {
    e.preventDefault();
    let cityName = $("#search-input").val();

    getCity(cityName);
    searchHistoryRecall();
    // weatherForecast.empty(); // clears out display of localStorage array
});

// retrieve searched cities
function searchHistoryRecall() {
    var searchHistory = localStorage.getItem('searches');
    console.log(searchHistory);
    if (searchHistory) {
        searchArray = JSON.parse(searchHistory);
        displaySearchHistory(searchArray);
    }
};

// history button click
$('#history').on("click", "button", function(e) {
    let cityName = $(e.target).attr("data-city");
    console.log(cityName);
    getCity(cityName);
});

// print searched cities    
function displaySearchHistory(searchData) {
    weatherHistory.empty();
    for (let i = 0; i < searchData.length; i++) {
        console.log(searchData);
        const element = searchData[i];
        // if (searchData[i].includes(cityName)) {
            weatherHistory.prepend($(`<button class="past-search btn btn-outline-dark mb-2" data-city="${element}">`).text(element));
            // }
            
        }
    };
    
    // clear search results
$('#clear-button').on("click", function(e){
    localStorage.clear();
});
    
searchHistoryRecall();