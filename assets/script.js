const API = "1de5c8ed9f7d7f5f4ff02c6b0cafa457";
var weatherToday = $("#today");


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
        var queryURL5days = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API;

        weatherToday.append($("<h1>").text(data.city.name));
        weatherToday.append($("<h2>").text(data.list[0].dt_txt));
        
        $.ajax({
            url: queryURL5days,
            method: "GET"
        }).then(function(data) {
            for (let i = 0; i < data.list.length; i++) {
                if (i % 8 === 0) {
                    console.log(i +' iterations have passed')
                    weatherToday.append($("<h2>").text(data.list[i].dt_txt));
                }
            
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

