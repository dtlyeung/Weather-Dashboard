function page(){
    const city = document.getElementById("searchbar");
    const search = document.getElementById("searchBtn");
    const clear = document.getElementById("clear");
    const location = document.getElementById("city");
    const temperature = document.getElementById("temperature");
    const humid = document.getElementById("humidity");
    const wind = document.getElementById("wind-speed");
    const uvindex = document.getElementById("UV-index");
    const history = document.getElementById("history");
    var fiveforecast = document.getElementById("forecast-header");
    var currentweather = document.getElementById("currentweather");
    let searchhistory = JSON.parse(localStorage.getItem("search"));

    //API Key
    const APIkey = "29c83668768fe3eab3d3472440f95f73";

    //get weather function
    function weather(cityname){
        //function to get weather from openweather
        let getURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + APIKey;
        axios.get(getURL)
            .then(function(response){
                currentweather.classList.remove("d-none");

                //display current weather - temperature, humidity, wind
                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                location.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                temperature.innerHTML = "Temperature: " + metric(response.data.main.temp) + " &#176C";
                humid.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                wind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                //display UV Index
                let latitude = response.data.coord.lat;
                let longitude = response.data.coord.lon;
                let UVIndexURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                axios.get(UVQueryURL)
                    .then(function (response) {
                        let UVscore = document.createElement("span");

                        //Colour coding UV index - Green, Yellow, Red
                        if (response.data[0].value < 4 ) {
                            UVscore.setAttribute("class", "badge badge-success");
                        }
                        else if (response.data[0].value < 8) {
                            UVscore.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            UVscore.setAttribute("class", "badge badge-danger");
                        }
                        console.log(response.data[0].value)
                        UVIndex.innerHTML = response.data[0].value;
                        uvindex.innerHTML = "UV Index: ";
                        uvindex.append(UVIndex);
                    });        

                //5 day forecast query
                let cityID = response.data.id;
                let forecastquery = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(forecastquery)
                    .then(function (response) {
                        fiveforecast.classList.remove("d-none");
                        
                        //Display 5 day forecast
                        const forecast = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecast.length; i++) {
                            forecast[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateA = document.createElement("p");
                            forecastDate.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDate.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecast[i].append(forecastDateA);

                            //Weather icon
                            const forecastWeather = document.createElement("img");
                            forecastWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeather.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecast[i].append(forecastWeather);
                            const forecastTemp = document.createElement("p");
                            forecastTemp.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecast[i].append(forecastTemp);
                            const forecastHumidity = document.createElement("p");
                            forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecast[i].append(forecastHumidity);
                        };
                });
            });
        };
    
    //Search history from localStorage
    search.addEventListener("click", function () {
        const searchTerm = city.value;
        weather(searchTerm);
        searchhistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        historysearch();
    });

    //Clear history
    clear.addEventListener("click", function () {
        localStorage.clear();
        searchhistory = [];
        historysearch();
    });

    //Convert Kelvin to celsius
    function metric(K){
        return Math.floor(K - 273.15)
    };

    //Search history function
    function historysearch() {
        history.innerHTML = "";
        for (let i = 0; i < searchhistory.length; i++) {
            const historycity = document.createElement("input");
            historycity.setAttribute("type", "text");
            historycity.setAttribute("readonly", true);
            historycity.setAttribute("class", "form-control d-block bg-white");
            historycity.setAttribute("value", searchhistory[i]);
            historycity.addEventListener("click", function () {
                weather(historycity.value);
            })
            history.append(historycity);
        };
    };
    historysearch();
    if (searchhistory.length > 0) {
        weather(searchhistory[searchhistory.length - 1]);
    };

};

page();

