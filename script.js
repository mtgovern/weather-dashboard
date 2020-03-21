// API key
var APIKey = "&appid=edb5b4c819aa1e47f2a2fbfa24aba9f4";

// URL needed to query database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

// array to add cities to, grabbed from search
var citiesArray = JSON.parse(localStorage.getItem("cities")) || [];

const m = moment();

// ON LOAD
$(document).ready(function() {
	var city = citiesArray[citiesArray.length - 1];
	fiveDay(city);
	citySearch(city);
});

// Current conditions
function citySearch(city) {
	// clear out previous city data
	$(".city").empty();
	$(".temp").empty();
	$(".humidity").empty();
	$(".wind").empty();
	$(".uvIndex").empty();

	var citySearch = queryURL + city + APIKey;
	console.log(citySearch);

	// ajax searching for new city to display
	$.ajax({
		url: citySearch,
		method: "GET"
	}).then(function(response) {

		// City
		var cityInfo = response.name;
		console.log(cityInfo);
		// Date
		var dateInfo = response.dt;
		console.log(dateInfo);
		var currentDate = moment.unix(dateInfo).format("L");
		console.log("current date" + currentDate);
		// Icon image 
		var iconDummy = "https://openweathermap.org/img/wn/";
		var iconPng = "@2x.png";
		var iconWeather = response.weather[0].icon;
		var iconUrl = iconDummy + iconWeather + iconPng;
		console.log(iconUrl);
		var iconImg = $("<img>");
		iconImg.attr("src", iconUrl);
		$(".city").append(cityInfo + " ");
		$(".city").append(currentDate + " ");
		$(".city").append(iconImg);

        // Temperature
		console.log(response.main.temp);
		var K = response.main.temp;
		console.log(K);
		var F = ((K - 273.15) * 1.8 + 32).toFixed(0);
		console.log(F);
		$(".temp").append("Temperature: " + F + " °F");

		// Humidity
		var humidityInfo = response.main.humidity;
		$(".humidity").append("Humidity: " + humidityInfo + "%");

		// Wind speed
		console.log(response.wind.speed);
		var oldSpeed = response.wind.speed;
		console.log(oldSpeed);
		var newSpeed = (oldSpeed * 2.2369).toFixed(2);
		$(".wind").append("Wind Speed: " + newSpeed + " MPH");

		// UV index
		var lon = response.coord.lon;
		var lat = response.coord.lat;

		// SEND OVER TO uvIndex()
		uvIndex(lon, lat);
	});
}

// // RECIEVES LAT/LON
function uvIndex(lon, lat) {
	// SEARCHES
	var indexURL =
		"https://api.openweathermap.org/data/2.5/uvi?appid=8c9bb7e0eeb10862d148cd62de471c05&lat=";
	var middle = "&lon=";
	var indexSearch = indexURL + lat + middle + lon;
	console.log(indexSearch);

	$.ajax({
		url: indexSearch,
		method: "GET"
	}).then(function(response) {
		var uvFinal = response.value;

		// then append button with uvFinal printed to it
		$(".uvIndex").append("UV Index: ");
		var uvBtn = $("<button>").text(uvFinal);
		$(".uvIndex").append(uvBtn);

	});
}

// RENDER BUTTONS CREATES NEW BUTTONS EACH TIME A CITY IS SEARCHED 

function renderButtons() {
	// Deleting buttons before adding ones
	$(".list-group").empty();

	// Looping through array of cities
	for (var i = 0; i < citiesArray.length; i++) {
		// Dynamicaly generating buttons for each
		var a = $("<li>");
		// Adding a class
		a.addClass("cityName");
		a.addClass("list-group-item");
		// Adding data-attribute
		a.attr("data-name", citiesArray[i]);
		// Providing initial button text
		a.text(citiesArray[i]);
		// Adding button to buttons-view div
		$(".list-group").append(a);
	}

	$(".cityName").on("click", function(event) {
		event.preventDefault();

		var city = $(this).data("name");
		console.log("prev searched city" + city);

		//give city info to five day forecast 
		fiveDay(city);
		//pull up info display
		citySearch(city);
	});
}

// Include 5-Day Forecast 
function fiveDay(city) {
	var fiveFront = "https://api.openweathermap.org/data/2.5/forecast?q=";
	var fiveURL = fiveFront + city + APIKey;
	console.log(fiveURL);

	//clear out previous data
	$(".card-text").empty();
	$(".card-title").empty();

	$.ajax({
		url: fiveURL,
		method: "GET"
	}).then(function(response) {
		//dates
		var dateOne = moment
			.unix(response.list[1].dt)
			.utc()
			.format("L");
		$(".dateOne").append(dateOne);
		var dateTwo = moment
			.unix(response.list[9].dt)
			.utc()
			.format("L");
		$(".dateTwo").append(dateTwo);
		var dateThree = moment
			.unix(response.list[17].dt)
			.utc()
			.format("L");
		$(".dateThree").append(dateThree);
		var dateFour = moment
			.unix(response.list[25].dt)
			.utc()
			.format("L");
		$(".dateFour").append(dateFour);
		var dateFive = moment
			.unix(response.list[33].dt)
			.utc()
			.format("L");
		$(".dateFive").append(dateFive);

		//icon
		var iconOne = $("<img>");
		var iconOneSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[4].weather[0].icon +
			"@2x.png";
		console.log("card Icon line 280" + iconOneSrc);
		iconOne.attr("src", iconOneSrc);
		$(".iconOne").append(iconOne);

		var iconTwo = $("<img>");
		var iconTwoSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[12].weather[0].icon +
			"@2x.png";
		iconTwo.attr("src", iconTwoSrc);
		$(".iconTwo").append(iconTwo);

		var iconThree = $("<img>");
		var iconThreeSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[20].weather[0].icon +
			"@2x.png";
		iconThree.attr("src", iconThreeSrc);
		$(".iconThree").append(iconThree);

		var iconFour = $("<img>");
		var iconFourSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[28].weather[0].icon +
			"@2x.png";
		iconFour.attr("src", iconFourSrc);
		$(".iconFour").append(iconFour);

		var iconFive = $("<img>");
		var iconFiveSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[36].weather[0].icon +
			"@2x.png";
		iconFive.attr("src", iconFiveSrc);
		$(".iconFive").append(iconFive);

		//temperature
		$(".tempOne").append("Temp: ");
		$(".tempOne").append(
			tempAvg(
				response.list[2].main.temp,
				response.list[4].main.temp,
				response.list[6].main.temp
			)
		);
		$(".tempOne").append(" °F");

		$(".tempTwo").append("Temp: ");
		$(".tempTwo").append(
			tempAvg(
				response.list[10].main.temp,
				response.list[12].main.temp,
				response.list[14].main.temp
			)
		);
		$(".tempTwo").append(" °F");

		$(".tempThree").append("Temp: ");
		$(".tempThree").append(
			tempAvg(
				response.list[18].main.temp,
				response.list[20].main.temp,
				response.list[22].main.temp
			)
		);
		$(".tempThree").append(" °F");

		$(".tempFour").append("Temp: ");
		$(".tempFour").append(
			tempAvg(
				response.list[26].main.temp,
				response.list[28].main.temp,
				response.list[30].main.temp
			)
		);
		$(".tempFour").append(" °F");

		$(".tempFive").append("Temp: ");
		$(".tempFive").append(
			tempAvg(
				response.list[34].main.temp,
				response.list[36].main.temp,
				response.list[38].main.temp
			)
		);
		$(".tempFive").append(" °F");

		// humidity
		$(".humidityOne").append("Humidity: ");
		$(".humidityOne").append(
			humidityAvg(
				response.list[2].main.humidity,
				response.list[4].main.humidity,
				response.list[6].main.humidity
			)
		);
		$(".humidityOne").append("%");

		$(".humidityTwo").append("Humidity: ");
		$(".humidityTwo").append(
			humidityAvg(
				response.list[10].main.humidity,
				response.list[12].main.humidity,
				response.list[14].main.humidity
			)
		);
		$(".humidityTwo").append("%");

		$(".humidityThree").append("Humidity: ");
		$(".humidityThree").append(
			humidityAvg(
				response.list[18].main.humidity,
				response.list[20].main.humidity,
				response.list[22].main.humidity
			)
		);
		$(".humidityThree").append("%");

		$(".humidityFour").append("Humidity: ");
		$(".humidityFour").append(
			humidityAvg(
				response.list[26].main.humidity,
				response.list[28].main.humidity,
				response.list[30].main.humidity
			)
		);
		$(".humidityFour").append("%");

		$(".humidityFive").append("Humidity: ");
		$(".humidityFive").append(
			humidityAvg(
				response.list[34].main.humidity,
				response.list[36].main.humidity,
				response.list[38].main.humidity
			)
		);
		$(".humidityFive").append("%");
	});
}

function tempAvg(x, y, z) {
	var avgThree = (x + y + z) / 3.0;
	var avgReturn = ((avgThree - 273.15) * 1.8 + 32).toFixed(0);
	return avgReturn;
}

function humidityAvg(x, y, z) {
	var avgHum = (x + y + z) / 3.0;
	return avgHum.toFixed(0);
}

// EVENTS
$("#add-city").on("click", function(event) {
	event.preventDefault();

	//grabs input from textbox
	var city = $("#city-input")
		.val()
		.trim();

	//push new city into Array
	var containsCity = false;

	if (citiesArray != null) {
		$(citiesArray).each(function(x) {
			if (citiesArray[x] === city) {
				containsCity = true;
			}
		});
	}

	if (containsCity === false) {
		citiesArray.push(city);
	}

	// add to local storage
	localStorage.setItem("cities", JSON.stringify(citiesArray));

	//give city info to five day forecast cards 
	fiveDay(city);

	// search for city
	citySearch(city);

	// button created for each city searched
	renderButtons();
});

renderButtons();