const today = moment().format('dddd, MMMM D, YYYY');
m = moment();
const API = "1de5c8ed9f7d7f5f4ff02c6b0cafa457";
var weatherToday = $("#today");
var weatherForecast = $("#forecast");

$("#search-button").click(function(e) {
    e.preventDefault();
    var cityName = $("#search-input").val();
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
        weatherToday.append($("<span>").text("Wind : " + windSpeed + " km/h"));
        weatherToday.append($("<span>").text("Humidity: " + humidity + " %"));
        weatherToday.append($("<h2>").text(data.list[0].dt_txt));
        console.log(data);
        
        $.ajax({
            url: queryURL5days,
            method: "GET"
        }).then(function(data) {
            // setting the date range for the 5 day forecast
            const start = new Date(m);
            const end = new Date(m.add(4, 'days'));
            
            let loop = new Date(start);
            while (loop <= end) {
                // console.log(loop);
                let newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
                var date = moment();
                var forecastDay = date.format('dddd');
                weatherForecast.append($("<div>").text(forecastDay).addClass("forecastDay"));
            }

            // var NowMoment = moment(); var eDisplayMoment = document.getElementById('displayMoment'); eDisplayMoment.innerHTML = NowMoment.format('YYYY-M-D'); 

            // var tempC = data.list[i].main.temp - 273.15; // converts Kelvin to Celsius
            // var icon = data.list[i].weather[i].icon; // pulls icon code in
            // var humidity = data.list[i].main.humidity; // pulls in humidity
            // var windSpeed = data.list[i].wind.speed * 3.6; // pulls in wind speed + converts to km/hr
            for (let i = 8; i < data.list.length; i++) {
                if (i % 8 === 0 || i === data.list.length - 1) {
                    // var date = moment().add(i, 'day');
                    console.log(data);
                    // console.log(date);
                    
                    // weatherForecast.append($("<h2>").text(data.list[i].dt_txt));

                }

            //     // if (i % 4 === 0) {
            //     //     // printing forecast of next 5 days
            //     // }

            // for (const forecast of data.list.slice(0, 8)) {
            //     this.forecastDisplay.push({
            //         time: forecast.dt_txt,
            //         temp: forecast.main.temp
            //         // humd: forecast.humidity,
            //         // icon: forecast.weather.icon,
            //         // wind: forecast.wind.speed
            //     });
            //     console.log(forecast);
            //     console.log(forecastDisplay);
            // }

            // let forecast = data.list.filter((_, i) => i % 8 == 0);
            // console.log(forecast);


            // const forecast = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
            
                // console.log(i)
            };
            // newArr = data.list.filter(function(value, index, Arr) {
            //     return console.log(index % 8 == 0);
            // });
            // console.log(typeof data.list);
            // console.log(index);

            // console.log(data);
            // console.log(data.list[0].weather[0].description);
            
        });


    });
});

