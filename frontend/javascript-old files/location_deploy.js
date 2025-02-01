async function deploy() {
				// contract deployment
				const [deployer] = await ethers.getSigners();
				console.log('Deploying contracts with the account: ' + deployer.address);

				// Deploy UserInformation
				const UserInformation = await ethers.getContractFactory('UserInformation');
				const userInfo = await UserInformation.deploy();
				await userInfo.waitForDeployment();
				console.log("User_Information deployed at: ", await userInfo.getAddress());

				// Deploy Task_Initialization
				const TaskInitialization = await ethers.getContractFactory('Task_Initialization');
				const taskInit = await TaskInitialization.deploy();
				await taskInit.waitForDeployment();
				console.log("Task_Initialization deployed at: ", await taskInit.getAddress());

				// Deploy Task_Selection_Process
				const TaskSelectionProcess = await ethers.getContractFactory('Task_Selection');
				const taskSelect = await TaskSelectionProcess.deploy();
				await taskSelect.waitForDeployment();
				console.log("Task_Selection_Process deployed at: ", await taskSelect.getAddress());

				// Deploy Reward_penalty_System
				const RewardPenaltySystem = await ethers.getContractFactory('Reward_Penalty_System');
				const rewardSys = await RewardPenaltySystem.deploy();
				await rewardSys.waitForDeployment();
				console.log("Reward_Penalty_System deployed at: ", await rewardSys.getAddress());

				return { userInfo, taskInit, taskSelect, rewardSys };
}

function getLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(printLocation);
			} else {
				console.log("Geolocation is not supported by this browser.");
			}
		}

		function printLocation(position) {
			console.log("Latitude: " + position.coords.latitude +
				"\nLongitude: " + position.coords.longitude);

			// get More information using the Geoapify key
			decode_latlong(position.coords.latitude, position.coords.longitude)
		}

		async function decode_latlong(lat, long) {
			// Replace YOUR_API_KEY with the api key you got from Geoapify
			const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${"4e8a03f4dcc24306a83086b605c64112"}`;

			fetch(apiUrl)
				.then(response => response.json())
				.then(data => {
					// Extract the city name from the response
					const cityName = data.features[0].properties.city;
					console.log(`The city is: ${cityName}`);
				})
				.catch(error => {
					console.error('Error:', error);
				});
		}

