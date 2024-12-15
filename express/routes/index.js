var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Fine my Coordinates
async function userRegistration(userInfo) {
    // calculates a cloaked version of the user's location
    navigator.getCurrentPosition()(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    } )

    const gridX = Math.floor(latitude / gridSize);
    const gridY = Math.floor(longitude / gridSize);
    const cloakedLatitude = gridX * gridSize + gridSize / 2;
    const cloakedLongitude = gridY * gridSize + gridSize / 2;

    try {
        const userName = "Melina";
        const userLocationLatitude = cloakedLatitude;
        const userLocationLongitude = cloakedLongitude;
        const userReg = await userInfo.setUser_Information(userName, userLocationLatitude, userLocationLongitude);
        await userReg.wait(); // Wait for transaction confirmation
        const userData = await userInfo.getUserInformation(0);
        console.log("User Name and Reputation: ", userData);
    } catch (error) {
        console.error('Error reading data:', error);
    }
}

module.exports = router;
