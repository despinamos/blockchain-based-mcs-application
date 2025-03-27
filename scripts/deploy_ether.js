var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

let provider;

if(typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(url);
}

const privateKey = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";
const wallet = new ethers.Wallet(privateKey, provider);

const { abi: userAbi} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json")

const { abi: taskInitAbi} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json")

const { abi: taskSelectAbi } = require("../artifacts/contracts/Task_Selection.sol/Task_Selection.json")

const { abi: rewardSysAbi } = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json")

const { bytecode: userBytecode} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json");

const { bytecode: taskInitBytecode} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json")

const { bytecode: taskSelectBytecode } = require("../artifacts/contracts/Task_Selection.sol/Task_Selection.json")

const { bytecode: rewardSysBytecode } = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json")

const deployUserInformation = async () => {
  console.log("Deploying User Information contract...")

  const userFactory = new ethers.ContractFactory(userAbi, userBytecode, wallet);
  const userContract = await userFactory.deploy();

  console.log('Transaction hash: ', userContract.deployTransaction.hash)


  await userContract.deployTransaction.wait();

  console.log("Contract deployed at:", userContract.address);
}

const deployTaskInitialization = async () => {
  console.log("Deploying Task Initialization contract...")

  const taskInitFactory = new ethers.ContractFactory(taskInitAbi, taskInitBytecode, wallet);
  const taskInitContract = await taskInitFactory.deploy();

  console.log('Transaction hash: ', taskInitContract.deployTransaction.hash)


  await taskInitContract.deployTransaction.wait();

  console.log("Contract deployed at:", taskInitContract.address);
}

const deployTaskSelection = async () => {
  console.log("Deploying Task Selection contract...")

  const taskSelectFactory = new ethers.ContractFactory(taskSelectAbi, taskSelectBytecode, wallet);
  const taskSelectContract = await taskSelectFactory.deploy();

  console.log('Transaction hash: ', taskSelectContract.deployTransaction.hash)


  await taskSelectContract.deployTransaction.wait();

  console.log("Contract deployed at:", taskSelectContract.address);
}

const deployRewardPenaltySystem = async () => {
  console.log("Deploying Reward Penalty System contract...")

  const rewardSysFactory = new ethers.ContractFactory(rewardSysAbi, rewardSysBytecode, wallet);
  const rewardSysContract = await rewardSysFactory.deploy();

  console.log('Transaction hash: ', rewardSysContract.deployTransaction.hash)


  await rewardSysContract.deployTransaction.wait();

  console.log("Contract deployed at:", rewardSysContract.address);
}


const deployAllContracts = async () => {
  await deployUserInformation();
  await deployTaskInitialization(); 
  await deployTaskSelection();
  await deployRewardPenaltySystem();
};

deployAllContracts().catch(console.error);