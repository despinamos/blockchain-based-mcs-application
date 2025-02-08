(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.getLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(printLocation);
		} else {
			console.log("Geolocation is not supported by this browser.");
		}
	}


let cityNameGlobal = " "
  exports = {cityNameGlobal} 

	window.decode_latlong = function(lat, long) {
		// Replace YOUR_API_KEY with the api key you got from Geoapify
		const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${"4e8a03f4dcc24306a83086b605c64112"}`;

		fetch(apiUrl)
			.then(response => response.json())
			.then(data => {
				// Extract the city name from the response
				const cityName = data.features[0].properties.city;
				console.log(`The city is: ${cityName}`);
                 cityNameGlobal = cityName;
			})
				.catch(error => {
					console.error('Error:', error);
				});
		}

		window.printLocation = function(position) {
			// console.log("Latitude: " + position.coords.latitude +
			// 	"\nLongitude: " + position.coords.longitude);

			// get city information using the Geoapify key
			const cityName = decode_latlong(position.coords.latitude, position.coords.longitude)
		}
},{}]},{},[1]);
