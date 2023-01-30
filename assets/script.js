const today = moment().format('dddd, MMMM D, YYYY');
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
        var icon = data.list[0].weather[0].icon;
        var iconImg = `https://openweathermap.org/img/wn/` + icon + `@2x.png`;
        console.log(iconImg);
        var queryURL5days = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API;

        weatherToday.append($("<img>").attr("src", iconImg).addClass("icon"))

        // prints city name, adds today's date, puts in div class
        weatherToday.append($("<span>").text(data.city.name).append(today).addClass("currentCity"));
        weatherToday.append($("<span>").text(tempC.toFixed(2) + " °C").addClass("currentTemp"));
        weatherToday.append($("<span>").text())
        weatherToday.append($("<h2>").text(data.list[0].dt_txt));
        console.log(data);
        // forecastDisplay = [];
        
        $.ajax({
            url: queryURL5days,
            method: "GET"
        }).then(function(data) {
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



            for (let i = 8; i < data.list.length; i++) {
                if (i % 8 === 0 || i === data.list.length - 1) {
                    console.log(data);
                    console.log(i +' iterations have passed')
                    weatherForecast.append($("<h2>").text(data.list[i].dt_txt));

                }

            //     // if (i % 4 === 0) {
            //     //     // printing forecast of next 5 days
            //     // }
            
                console.log(i)
            };
            // newArr = data.list.filter(function(value, index, Arr) {
            //     return console.log(index % 8 == 0);
            // });
            console.log(typeof data.list);
            console.log(index);

            console.log(data);
            console.log(data.list[0].weather[0].description);
            
        });


    });
});

