const API = "1de5c8ed9f7d7f5f4ff02c6b0cafa457";
const today = moment().format('dddd, MMMM D, YYYY');
var weatherToday = $("#today");
var weatherForecast = $("#forecast");
var weatherHistory = $("#history");
let cityName = "";
let searchArray = []; // declare variable as empty array

// get city weather
function getCity() {
    var queryURL ="https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(data) {
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
        weatherToday.append($("<h2>").text(data.list[0].dt_txt));
        console.log(data);
        
        getForecast(lat, lon);
    });
}

// get 5 day forecast
function getForecast(lat, lon) {
    var queryURL5days = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API;

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
}

// click event listener -> search button
$("#search-button").click(function(e) {
    e.preventDefault();
    let cityName = $("#search-input").val();
    if (searchArray.includes(cityName) || cityName === "") {
        return;
    } else {
        searchArray.push(cityName);
        console.log(searchArray);
        localStorage.setItem(`searches`, JSON.stringify(searchArray)); // puts the searched city into storage
    } 
    // console.log(cityName);
    getCity();
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

// searchHistoryRecall();

// print searched cities    
function displaySearchHistory(searchData) {
    for (let i = 0; i < searchData.length; i++) {
        console.log(searchData);
        const element = searchData[i];
        if (searchData[i].includes(cityName)) {
            weatherHistory.prepend($(`<button class="past-search btn btn-outline-dark mb-2" data-city="${element}">`).text(element));
        }
        
    }
};

// clear search results
$('#clear-button').on("click", function(e){
    localStorage.clear();
});






































// // adds city to search history + is made available as input text
// function recallHistory (searchingHistory) {
//     var storedCities = localStorage.getItem("searchingHistory");
//     if (storedCities) {
//         var storedCities = JSON.parse(storedCities);
//         console.log(storedCities);
//     }

// }

// function printSearchHistory(searchingHistory) {
//     for (let i = 0; i < searchingHistory.length; i++) {
//         const element = searchingHistory[i];
//         if (searchingHistory[i].includes(cityName)) {
//             searchHistory.prepend($(`<button class="btn searched" data-city="${element}}>`.text(element)))
//         }
//         console.log(searchHistory);
//     }
// }

// printSearchHistory();
// recallHistory();
