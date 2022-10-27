const express = require("express");
const router = express.Router();
const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});
const axios = require("axios");
require('dotenv').config({ path: '.env' });

/* GET home page. */
router.get("/", async function (req, res, next) {
	res.render("index", { title: "19BEE0257 Plotline Assignemnt" });
});

router.post("/distance", async function (req, res, next) {
	try {
		const placeIDs = req.body.placeIDs;

		const config = {
			method: "get",
			url: "https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:"+placeIDs[0]+"&destinations=place_id:"+placeIDs[1]+"&key="+process.env.MAPS_API_KEY,
			headers: {},
		};

		axios(config)
			.then(function (response) {
				console.log(JSON.stringify(response.data));
        res.send(response.data.rows[0].elements[0].distance)
			})
			.catch(function (error) {
				console.log(error);
			});
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
