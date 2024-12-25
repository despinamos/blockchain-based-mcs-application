// Initialize Web3
import userArtifact from '../artifacts/contracts/User_Related.sol/UserInformation.json';
import taskInitArtifact from '../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json';
import taskSelectArtifact from '../artifacts/contracts/Task_Selection.sol/Task_Selection.json';
import rewardSysArtifact from '../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const { abi: userAbi, bytecode: userBytecode } = userArtifact; // ABI and Bytecode for UserInformation
const { abi: taskInitAbi, bytecode: taskInitBytecode } = taskInitArtifact; // ABI and Bytecode for TaskInitialization
const { abi: taskSelectAbi, bytecode: taskSelectBytecode } = taskSelectArtifact; // ABI and Bytecode for TaskSelectionProcess
const { abi: rewardSysAbi, bytecode: rewardSysBytecode } = rewardSysArtifact; // ABI and Bytecode for RewardPenaltySystem


async function deployContracts() {

  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0];
  console.log("Deploying contracts with the account: " + deployer);

  // Deploy UserInformation
  const userInfo = new web3.eth.Contract(userAbi);
  const userInfoInstance = await userInfo.deploy({ data: userBytecode }).send({ from: deployer, gas: 5000000 });
  console.log("User_Information deployed at: ", userInfoInstance.options.address);

  // Deploy TaskInitialization
  const taskInit = new web3.eth.Contract(taskInitAbi);
  const taskInitInstance = await taskInit.deploy({ data: taskInitBytecode }).send({ from: deployer, gas: 5000000 });
  console.log("Task_Initialization deployed at: ", taskInitInstance.options.address);

  // Deploy TaskSelectionProcess
  const taskSelect = new web3.eth.Contract(taskSelectAbi);
  const taskSelectInstance =  await taskSelect.deploy({ data: taskSelectBytecode }).send({ from: deployer, gas: 5000000 });
  console.log("Task_Selection_Process deployed at: ", taskSelectInstance.options.address);

  // Deploy RewardPenaltySystem
  const rewardSys = new web3.eth.Contract(rewardSysAbi);
  const rewardSysInstance =  await rewardSys.deploy({ data: rewardSysBytecode }).send({ from: deployer, gas: 5000000 });
  console.log("Reward_Penalty_System deployed at: ", rewardSysInstance.options.address);


  // User Contract Information
const contractAddress = userInfoInstance.options.address; // Replace with your deployed contract address
const contractABI = userAbi; // Replace with your contract's ABI
const userRegistration = new web3.eth.Contract(abi, userInfoInstance.options.address);


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
    
    userRegistration.methods.setUser_Information(name).send({
      from: accounts[0],
    });

    alert("Data successfully stored on the blockchain!");
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while submitting data.");
  }
});
}

deployContracts().catch(console.error);