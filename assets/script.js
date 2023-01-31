const today = moment().format('dddd, MMMM D, YYYY');
const API = "1de5c8ed9f7d7f5f4ff02c6b0cafa457";
var weatherToday = $("#today");
var weatherForecast = $("#forecast");
var searchHistory = $("#history");
var searches = [];

$("#search-button").click(function(e) {
    e.preventDefault();
    var cityName = $("#search-input").val();
    if (searches.includes(cityName) || cityName === "") {
        return;
    } else {
        searches.push(cityName)
        console.log(searches);
        localStorage.setItem("searchingHistory", JSON.stringify(searches));
    } 
    recallHistory();
    // getCurrentCity();
    // forecastTitle.empty()
    // weatherForecast.empty()
    
    
    console.log(cityName);
    var queryURL ="https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(data) {
        var lat = data.city.coord.lat; // pulls in lat
        var lon = data.city.coord.lon; // pulls in lon
        var tempC = data.list[0].main.temp - 273.15; // converts Kelvin to Celsius
        var icon = data.list[0].weather[0].icon; // pulls icon code in
        var humidity = data.list[0].main.humidity; // pulls in humidity
        var windSpeed = data.list[0].wind.speed * 3.6; // pulls in wind speed (metre/sec) + converts to km/hr
        var iconImg = `https://openweathermap.org/img/wn/` + icon + `@2x.png`;

        var queryURL5days = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API;

        // prints weather icon
        weatherToday.append($("<img>").attr("src", iconImg).addClass("icon"))

        // prints city name, adds today's date, puts in div class
        weatherToday.append($("<span>").text(data.city.name).append(today).addClass("currentCity"));
        weatherToday.append($("<span>").text("Temp: " + tempC.toFixed(2) + " °C").addClass("currentTemp"));
        weatherToday.append($("<span>").text("Wind : " + windSpeed.toFixed(2) + " km/h"));
        weatherToday.append($("<span>").text("Humidity: " + humidity + " %"));
        weatherToday.append($("<h2>").text(data.list[0].dt_txt));
        console.log(data);
        
        $.ajax({
            url: queryURL5days,
            method: "GET"
        }).then(function(data) {        
            for (let i = 8; i < data.list.length; i++) {
                if (i % 8 === 0 || i === data.list.length - 1) {
                    var date = moment().add(i, 'day');
                    var tempC = data.list[i].main.temp - 273.15; // converts Kelvin to Celsius
                    var icon = data.list[i].weather[0].icon; // pulls icon code in
                    var iconTxt = data.list[i].weather[0].description // pulls in weather description
                    var iconImg = `https://openweathermap.org/img/wn/` + icon + `@2x.png`; // adds icon code to url
                    var humidity = data.list[i].main.humidity; // pulls in humidity
                    var windSpeed = data.list[i].wind.speed * 3.6; // pulls in wind speed + converts to km/hr
                    // console.log(data);
                    // console.log(date);
                    weatherForecast.append(`<p class="date">${moment(data.list[i].dt_txt).format('dddd')}</p>`);
                    weatherForecast.append($("<img>").attr("src", iconImg).attr("alt", iconTxt).addClass("icon"));
                    weatherForecast.append($("<span>").text("Temp: " + tempC.toFixed(2) + " °C").addClass("currentTemp"));
                    weatherForecast.append($("<span>").text("Wind : " + windSpeed.toFixed(2) + " km/h"));
                    weatherForecast.append($("<span>").text("Humidity: " + humidity + " %"));
                }
            };
        });
    });





});

// // adds city to search history + is made available as input text
function recallHistory (searchingHistory) {
    var storedCities = localStorage.getItem("searchingHistory");
    if (storedCities) {
        var storedCities = JSON.parse(storedCities);
        console.log(storedCities);
    }
}
