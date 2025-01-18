const  Web3  = require('web3');

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

async function interact() {
	// const accounts = await web3.eth.getAccounts();
	// const defaultAccount = accounts[0];
	console.log("I see you")
}

// interact();