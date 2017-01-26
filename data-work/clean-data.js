var fs = require('fs');

	// Read the list of Global airports JSON file..
	fs.readFile('airports.js', 'utf8', function (err,data) {
		if (err) { console.log('error reading file'); }

		// Parse the airport data.
		var airports = JSON.parse(data);

		// Create an empty array for our US Airport data.
		var USAirportData = [];

		for (var i = 0; i < airports.length; i++) {
			var airport = airports[i];
				if (airport.country && airport.country == 'United States') {
					var newAirportObject = {};
					newAirportObject.code = airport.code;
					newAirportObject.name = airport.name;
					newAirportObject.lat = airport.lat;
					newAirportObject.lon = airport.lon;
					newAirportObject.city = airport.city;
					newAirportObject.state = airport.state;
					USAirportData.push(newAirportObject);
				}
		}

		fs.writeFile("us-airports.js", JSON.stringify(USAirportData), function(err) {
			if (err) { console.log('error writing file'); }
			console.log('Saved file with US Airports only.');
		});

});
