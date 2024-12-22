// Initialize Web3
const web3 = new Web3(Web3.givenProvider || "http://localhost:5500");

// Contract Information
const contractAddress = "../contracts/User_Related.sol"; // Replace with your deployed contract address
const contractABI = [/* ABI from your compiled contract */]; // Replace with your contract's ABI
const contract = new web3.eth.Contract(abi, bytecode);

const { abi: userAbi, bytecode: userBytecode } = require("../artifacts/contracts/User_Related.sol/UserInformation.json"); // ABI and Bytecode for UserInformation
const { abi: taskInitAbi, bytecode: taskInitBytecode } = require("../artifacts/contracts/Task_Related.sol/Task_Initialization.json"); // ABI and Bytecode for TaskInitialization
const { abi: taskSelectAbi, bytecode: taskSelectBytecode } = require("../artifacts/contracts/Task_Related.sol/Task_Selection_Process.json"); // ABI and Bytecode for TaskSelectionProcess
const { abi: rewardSysAbi, bytecode: rewardSysBytecode } = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json"); // ABI and Bytecode for RewardPenaltySystem
const contract = new web3.eth.Contract(abi, bytecode);


// Form Submission
document.getElementById("dataForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;

  if (!name) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const accounts = await web3.eth.requestAccounts(); // Request user's wallet accounts

    // Interact with the contract
    await contract.methods.setUser(name, age).send({
      from: accounts[0],
    });

    alert("Data successfully stored on the blockchain!");
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while submitting data.");
  }
});
