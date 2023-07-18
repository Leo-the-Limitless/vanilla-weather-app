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

  return `Updated At: ${day} ${hours}:${minutes}`;
}

function displayTemp(response) {
  let tempElement = document.querySelector("#temp");
  tempElement.innerHTML = Math.round(response.data.main.temp);

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  let conditionElement = document.querySelector("#condition");
  conditionElement.innerHTML = response.data.weather[0].description;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let currentTime = document.querySelector("#currentTime");
  currentTime.innerHTML = formatDate(response.data.dt * 1000);
}

function showError(error) {
  let errorMsg = document.querySelector("#errorMsg");
  errorMsg.innerHTML = error.response.data.message;
}

let apiKey = "ad793a6d772939c31783de5822791acf";

let city = "Yangon";

let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(apiUrl).then(displayTemp).catch(showError);
