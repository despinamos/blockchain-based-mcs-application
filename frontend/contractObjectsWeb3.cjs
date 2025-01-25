const Web3 = require('web3');

const  web3= new Web3('http://127.0.0.1:8545/');

// Contracts' deployment addresses
const userContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const taskInitContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const taskSelectAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const rewardSysAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const { abi: userAbi} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json");
const { abi: taskInitAbi} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json");
const { abi: taskSelectAbi} = require("../artifacts/contracts/Task_Selection.sol/Task_Selection.json");
const { abi: rewardSysAbi} = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json");

// Create contract object

const userContract = new web3.eth.Contract(userAbi, userContractAddress);
const taskInitContract = new web3.eth.Contract(taskInitAbi, taskInitAbi);
userContract.handleRevert = true;
taskInitContract.handleRevert = true;

window.interact = function() {
  
  const accounts = web3.eth.getAccounts();
  const defaultAccount = accounts[0];

  const userContract = new web3.eth.Contract(userAbi, userContractAddress);
	userContract.handleRevert = true;
	console.log("I see you")



    // Form Submission
		try {
      document.getElementById("dataForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
    if(username === "") {
      alert("Please enter a username");
    }else{
      const name = document.getElementById("username").value;
      console.log("Username after submit: ", name)
    }
        console.log("City name after submit: ", cityNameGlobal)
    });
    } catch (error) {
      console.error('Lets talk about it: ' + error);
    }
}


		window.getLocation = function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(printLocation);
			} else {
				console.log("Geolocation is not supported by this browser.");
			}
		}


    let cityNameGlobal = " "

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
