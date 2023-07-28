let city;
let apiKey = "f93b4360eb1048bfa54113248231807";

function formatDate(date) {
  let newDate = new Date(date);
  let hours = newDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = newDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[newDate.getDay()];

  return `Local Time: ${day} ${hours}:${minutes}`;
}

function formatDay(date) {
  let day = new Date(date);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let formattedDay = days[day.getDay()];
  return formattedDay;
}

let apiResponse;

function displayImage() {
  let image;
  let currentTemp = Math.round(apiResponse.data.current.temp_c);
  if (currentTemp < 10) {
    image = "cold-temp";
  } else if (currentTemp >= 10 && currentTemp < 20) {
    image = "normal-temp";
  } else if (currentTemp >= 20 && currentTemp < 30) {
    image = "upper-normal-temp";
  } else if (currentTemp >= 30 && currentTemp < 40) {
    image = "hot-temp";
  } else {
    image = "extreme-hot-temp";
  }
  let weatherImageElement = document.querySelector("#weather-image");
  weatherImageElement.innerHTML = `<img src="images/${image}.png" alt="weather-image" id="temp-image">`;
}

function displayData(response) {
  // console.log(response);
  if (city.toLowerCase() === response.data.location.name.toLowerCase()) {
    apiResponse = response;
    fahrenheitLink.classList.remove("active");
    celsiusLink.classList.add("active");
    let tempElement = document.querySelector("#temp");
    tempElement.innerHTML = Math.round(response.data.current.temp_c);

    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.data.location.name;

    let conditionElement = document.querySelector("#condition");
    conditionElement.innerHTML = response.data.current.condition.text;

    let humidityElement = document.querySelector("#humidity");
    humidityElement.innerHTML = response.data.current.humidity;

    let windElement = document.querySelector("#wind");
    windElement.innerHTML = Math.round(response.data.current.wind_mph);

    let currentTime = document.querySelector("#currentTime");
    currentTime.innerHTML = formatDate(response.data.location.localtime);

    let icon = document.querySelector("#icon");
    icon.setAttribute("src", response.data.current.condition.icon);
    icon.setAttribute("alt", response.data.current.condition.text);

    displayImage();

    let apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;
    axios.get(apiUrl).then(displayForecast);
  } else {
    displayError();
  }
}

function displayError() {
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-right",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "300",
    timeOut: "2500",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };
  toastr.error("City not found");
}

function showError(error) {
  if (error.response.status === 400) {
    displayError();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#cityInput");
  if (cityInput.value !== "") search(cityInput.value);
}

let searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", handleSubmit);

function search(searchCity) {
  city = searchCity;
  let apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${searchCity}&aqi=no`;
  axios.get(apiUrl).then(displayData).catch(showError);
}

function displayForecast(response) {
  let forecast = response.data.forecast.forecastday.slice(0, 5);
  let forecastHtml = "";

  forecast.forEach((forecastDay) => {
    forecastHtml =
      forecastHtml +
      `<div class="col-2 forecast-each">
          <div class="forecast-date">${formatDay(forecastDay.date)}</div>
          <img src="${forecastDay.day.condition.icon}" alt="" width="36px">
          <p class="forecast-temp"><span class="forecast-temp-max">${Math.round(
            forecastDay.day.maxtemp_c
          )}°</span> <span
              class="forecast-temp-min">${Math.round(
                forecastDay.day.mintemp_c
              )}°</span></p>
        </div>`;
  });

  let forecastElement = document.querySelector("#forecast-section");
  forecastElement.innerHTML = forecastHtml;
}

function showFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temp");
  tempElement.innerHTML = Math.round(apiResponse.data.current.temp_f);
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
}

function showCelsius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temp");
  tempElement.innerHTML = Math.round(apiResponse.data.current.temp_c);
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

let fahrenheitLink = document.querySelector("#to-fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheit);

let celsiusLink = document.querySelector("#to-celsius");
celsiusLink.addEventListener("click", showCelsius);

search("Yangon");
