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