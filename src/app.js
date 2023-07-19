let city = "Yangon";

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

function displayTemp(response) {
  // console.log(response);
  if (city.toLowerCase() === response.data.location.name.toLowerCase()) {
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
  } else {
    let errorMsg = document.querySelector("#errorMsg");
    errorMsg.innerHTML = "City not found";
  }
}

function showError(error) {
  if (error.response.status === 400) {
    let errorMsg = document.querySelector("#errorMsg");
    errorMsg.innerHTML = "City not found";
  }
}

let apiKey = "f93b4360eb1048bfa54113248231807";

let apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

axios.get(apiUrl).then(displayTemp).catch(showError);
