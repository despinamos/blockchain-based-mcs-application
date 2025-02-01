const Web3 = require('web3');

// Use window.ethereum if in a browser, otherwise connect to localhost
let web3;
if (typeof window !== "undefined" && window.ethereum) {
    web3 = new Web3(window.ethereum);
} else {
    web3 = new Web3('http://127.0.0.1:8545/');
}

const { abi: userAbi} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json");
//const { abi: taskInitAbi} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json");

const { bytecode: userBytecode} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json");
//const { bytecode: taskInitBytecode} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json");

// Create contract object for User Information and Task Initialization

const userContract = new web3.eth.Contract(userAbi);
//const taskInitContract = new web3.eth.Contract(taskInitAbi);
userContract.handleRevert = true;
//taskInitContract.handleRevert = true;

async function deploy() {
	const providersAccounts = await web3.eth.getAccounts();
	const defaultAccount = providersAccounts[0];
	console.log('Deployer account:', defaultAccount);

	//user deploy

	const userContractDeployer = userContract.deploy({
		data: userBytecode
	})

	const userGas = await userContractDeployer.estimateGas({
		from: defaultAccount,
	});
	console.log('User Estimated gas:', userGas);

	try {
		const tx = await userContractDeployer.send({
			from: defaultAccount,
			userGas,
			gasPrice: 10000000000,
		});
		console.log('User contract deployed at address: ' + tx.options.address);

	} catch (error) {
		console.error(error);
	}

}

window.interact = async function() {
	console.log("Starting interaction...");

	// Deploy contract 
	await deploy();

  const userContract = new web3.eth.Contract(userAbi);
	userContract.handleRevert = true;
	console.log("I see you")

	 // Use window.ethereum if running in a browser
	 let providersAccounts = [];
	 if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const providersAccounts = await web3.eth.getAccounts();
    console.log("Interact account:", providersAccounts[0]);
  } else {
    console.error("No Web3 provider found. Please install MetaMask.");
  }

	const defaultAccount = providersAccounts[0];

	const userContractInstance = new web3.eth.Contract(userAbi, userContract.options.address);

// Form Submission
  const form = document.getElementById("dataForm");

    let username = document.getElementById("username").value;

    if(username == "") {
      alert("Please enter a username");
    } else {
      console.log("Username after submit: ", username);
      console.log("City name after submit: ", cityNameGlobal);
    }

		try {
		
			// Interact with the user contract
			// 		Register user
					const receipt = await userContract.methods.setUser_Information(username, cityNameGlobal).send({
						from: defaultAccount,
						gas: 1000000,
						gasPrice: '10000000000',
					});
					console.log('Transaction Hash: ' + receipt.transactionHash);

					// Get user info
					const userInfo = await userContract.methods.getUserInformation(0).call();
					console.log('User information: ' + userInfo);
		
			alert("Data successfully stored on the blockchain!");
			} catch (error) {
						console.error(error);
			}
      // Reset the form
      form.reset();

      // Remove the event listener
      document.getElementById("dataForm").removeEventListener("submit", form);

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