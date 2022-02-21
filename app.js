const timeID = document.querySelector("#time");
const dateID = document.querySelector("#date");
const currentWeatherItems = document.querySelector("#current-weather-items");
const timezone = document.querySelector("#time-zone");
const country = document.querySelector("#country");
const weatherForecast = document.querySelector("#weather-forecast");
const currentTemp = document.querySelector("#current-temp");

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const APIKey = "261d8068a3cca30de0ed1d3cf36f30a2";

setInterval(() => {
	const time = new Date();
	const month = time.getMonth();
	const date = time.getDate();
	const day = time.getDay();
	const hours = time.getHours();
	const formatedHour = hours >= 13 ? hours % 12 : hours;
	const minutes = time.getMinutes();
	const amPm = hours >= 12 ? "PM" : "AM";

	timeID.innerHTML =
		(formatedHour < 10 ? "0" + formatedHour : formatedHour) +
		":" +
		(minutes < 10 ? "0" + minutes : minutes) +
		`<span id="am-pm">${amPm}</span>`;

	dateID.innerHTML = days[day] + "," + date + " " + months[month];
}, 1000);

getWeather();

function getWeather() {
	navigator.geolocation.getCurrentPosition((success) => {
		// console.log(success);

		let { latitude, longitude } = success.coords;

		fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${APIKey}`
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				showWeatherData(data);
			});
	});
}

function showWeatherData(data) {
	let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
	timezone.innerHTML = data.timezone;
	country.innerHTML = data.lat + "N " + data.lon + "E";

	currentWeatherItems.innerHTML = `<div class="weather-item">
<div>Humidity</div>
<div>${humidity}%</div>
</div>
<div class="weather-item">
<div>Pressure</div>
<div>${pressure}</div>
</div>
<div class="weather-item">
<div>Wind Speed</div>
<div>${wind_speed}</div>
</div>
<div class="weather-item">
<div>Sunrise</div>
<div>${window.moment(sunrise * 1000).format("HH:MM a")}</div>
</div>
<div class="weather-item">
<div>Sunset</div>
<div>${window.moment(sunset * 1000).format("HH:MM a")}</div>
</div>

`;

	let otherDayForecast = "";
	data.daily.forEach((day, idx) => {
		if (idx == 0) {
			currentTemp.innerHTML = ` <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon"
										class="w-icon">
									<div class="other">
										<div class="day">Monday</div>
										<div class="temp">Night - ${day.temp.night}&#176; C</div>
										<div class="temp">Day - ${day.temp.day}&#176; C</div>
									</div>`;
		} else {
			otherDayForecast += `
		<div class="weather-forecast-item">
                <div class="day">${window
									.moment(day.dt * 1000)
									.format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
									day.weather[0].icon
								}@2x.png" alt="weather icon"
                    class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>
		`;
		}
	});

	weatherForecast.innerHTML = otherDayForecast;
}
