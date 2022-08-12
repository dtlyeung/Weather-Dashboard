function page(){
    const city = document.getElementById();
    const search = document.getElementById();
    const clear = document.getElementById();
    const location = document.getElementById();
    const temperature = document.getElementById();
    const humid = document.getElementById();
    const wind = document.getElementById();
    const uvindex = document.getElementById();
    const history = document.getElementById();
    var fiveforecast = document.getElementById();
    var currentweather = document.getElementById();
    let searchhistory = JSON.parse(localStorage.getItem(""));

    //API Key
    const APIkey = "29c83668768fe3eab3d3472440f95f73";

    //get weather function
    function weather(cityname){
        //function to get weather from openweather
        let getURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + APIKey;
        axios.get(getURL)
            .then(function(response){
                todayweatherEl.classList.remove("d-none");

                //display current weather - temperature, humidity, wind
                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                location.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

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
                        }
                })
            })
        }
    
    //Search history from localStorage
    search.addEventListener("click", function () {
        const searchTerm = city.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })
