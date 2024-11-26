// Import Firebase modules for Realtime Database (v9+)
const { initializeApp } = require("firebase/app");
const { getDatabase, ref } = require("firebase/database");
const { GeoFire } = require("geofire");

// Firebase config for your Realtime Database
const firebaseConfig = {
	apiKey: "AIzaSyBFQoZNCFNeIjvf_uYuzYx3QB75CsIRT-E",
	authDomain: "gazipur-city.firebaseapp.com",
	databaseURL:
		"https://gazipur-city-default-rtdb.asia-southeast1.firebasedatabase.app", // This points to Realtime Database
	projectId: "gazipur-city",
	storageBucket: "gazipur-city.appspot.com",
	messagingSenderId: "854425038476",
	appId: "1:854425038476:web:fd028f67e25771be7d55a9",
	measurementId: "G-Z7N26V51TC",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const firebaseRef = ref(database, "activeDrivers");

const geoFire = new GeoFire(firebaseRef);

module.exports = { geoFire, firebaseRef };
