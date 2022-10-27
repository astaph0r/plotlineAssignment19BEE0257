let lat = [];
let lng = [];
let placeIDs = [];

function initialize() {
	const CONFIGURATION = {
		ctaTitle: "Calculate",
		mapOptions: {
			center: { lat: 37.4221, lng: -122.0841 },
			fullscreenControl: true,
			mapTypeControl: false,
			streetViewControl: false,
			zoom: 8,
			zoomControl: true,
			maxZoom: 22,
			mapId: "",
		},
		mapsApiKey: "AIzaSyCgQL4pQ0zgFAkOXclUlWh1L8IzV8-2xnA",
		capabilities: {
			addressAutocompleteControl: true,
			mapDisplayControl: true,
			ctaControl: true,
		},
	};
	const map = new google.maps.Map(document.getElementById("gmp-map"), {
		zoom: CONFIGURATION.mapOptions.zoom,
		center: { lat: 37.4221, lng: -122.0841 },
		mapTypeControl: false,
		fullscreenControl: CONFIGURATION.mapOptions.fullscreenControl,
		zoomControl: CONFIGURATION.mapOptions.zoomControl,
		streetViewControl: CONFIGURATION.mapOptions.streetViewControl,
	});
	const marker1 = new google.maps.Marker({ map: map, draggable: false });
	const marker2 = new google.maps.Marker({ map: map, draggable: false });
	let marker = [marker1, marker2];
	let inputs = document.getElementsByClassName("autofast");

	const options = {
		types: ["(cities)"],
	};

	let autocompletes = [];

	for (let i = 0; i < inputs.length; i++) {
		count = i;
		let autocomplete = new google.maps.places.Autocomplete(
			inputs[i],
			options
		);
		autocomplete.inputId = inputs[i].id;
		autocomplete.addListener("place_changed", function () {
			marker[i].setVisible(false);
			const place = autocomplete.getPlace();
			lat[i] = place.geometry.location.lat();
			lng[i] = place.geometry.location.lng();
			placeIDs[i] = place.place_id;
			// fillIn;
			renderAddress(place, marker[i]);
			setBounds();
		});
		autocompletes.push(autocomplete);
	}

	function renderAddress(place, marker) {
		map.setCenter(place.geometry.location);
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);
	}

	function setBounds() {
		if (lat.length > 1 && lng.length > 1) {
			let bounds = new google.maps.LatLngBounds();
			bounds.extend({lat: lat[1], lng: lng[1]});
			bounds.extend({lat: lat[0], lng: lng[0]});
			map.fitBounds(bounds);
		}
	}
}

function getDistance() {
	distDiv = document.getElementById("distance");
	if (placeIDs.length < 2) {
		distDiv.innerHTML = "<h4>Please provide both cities.</h4>";
		return;
	}
	fetch("/distance", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ placeIDs }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			distDiv.innerHTML =
				"<h4>" + data.text + " or " + data.value + " m</h4>";
		})
		.catch((error) => {
			console.error("Error:", error);
			distDiv.innerHTML = "<h4>Some Error Occured</h4>";
		});
}
