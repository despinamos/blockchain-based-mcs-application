var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

// data quality functions
const findSmallestDifference = require('./data_quality/dataQuality.js').findSmallestDifference
const validPointsArray = require('./data_quality/dataQuality.js').validPointsArray

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

const { bytecode: userBytecode} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json")

const { bytecode: taskInitBytecode} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json")
 
const { bytecode: taskSelectBytecode } = require("../artifacts/contracts/Task_Selection.sol/Task_Selection.json")

const { bytecode: rewardSysBytecode } = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json")

// Contract Deployment
// Functions return the address of the deployed contract

const deployUserInformation = async () => {
  console.log("Deploying User Information contract...")

  const userFactory = new ethers.ContractFactory(userAbi, userBytecode, wallet);
  const userContract = await userFactory.deploy();

  console.log('Transaction hash: ', userContract.deployTransaction.hash)

  await userContract.deployTransaction.wait();

  console.log("Contract deployed at:", userContract.address);

  const userConAddress = userContract.address;

  return userConAddress;
}

const deployTaskInitialization = async () => {
  console.log("Deploying Task Initialization contract...")

  const taskInitFactory = new ethers.ContractFactory(taskInitAbi, taskInitBytecode, wallet);
  const taskInitContract = await taskInitFactory.deploy();

  console.log('Transaction hash: ', taskInitContract.deployTransaction.hash)


  await taskInitContract.deployTransaction.wait();

  console.log("Contract deployed at:", taskInitContract.address);

  const taskInitAddress = taskInitContract.address;

  return taskInitAddress;
}

const deployTaskSelection = async () => {
  console.log("Deploying Task Selection contract...")

  const taskSelectFactory = new ethers.ContractFactory(taskSelectAbi, taskSelectBytecode, wallet);
  const taskSelectContract = await taskSelectFactory.deploy();

  console.log('Transaction hash: ', taskSelectContract.deployTransaction.hash)


  await taskSelectContract.deployTransaction.wait();

  console.log("Contract deployed at:", taskSelectContract.address);

  const taskSelectAddress = taskSelectContract.address;

  return taskSelectAddress;
}

const deployRewardPenaltySystem = async () => {
  console.log("Deploying Reward Penalty System contract...")

  const rewardSysFactory = new ethers.ContractFactory(rewardSysAbi, rewardSysBytecode, wallet);
  const rewardSysContract = await rewardSysFactory.deploy();

  console.log('Transaction hash: ', rewardSysContract.deployTransaction.hash)


  await rewardSysContract.deployTransaction.wait();

  console.log("Contract deployed at:", rewardSysContract.address);

  const rewardSysAddress = rewardSysContract.address;

  return rewardSysAddress;
}

// Calling UserInformation methods

async function callSetUserInformation(userConAddress, userName, userLocation) {

  console.log("Registering new User process started...");

  try {
    const userContract = new ethers.Contract(userConAddress, userAbi, wallet);
    const estimatedGas = await userContract.estimateGas.setUser_Information(userName, userLocation);

    const result = await userContract.setUser_Information(userName, userLocation, {
      gasLimit: estimatedGas.mul(2),
    });
    await result.wait();
    console.log("User data successfully stored on the blockchain!")
  } catch(error) {
        console.error("Something went wrong with user registration", error);

  }

}

async function callGetUserInformation(userConAddress, userId) {

  console.log("Get user information process started...");

  try {
    const userContract = new ethers.Contract(userConAddress, userAbi, provider);

    const result = await userContract.getUserInformation(userId);
    console.log(result)
  } catch(error) {
    console.error("Something went wrong", error);
  }
}

// Calling Task_Initialization methods

async function callSetTaskInformation(taskInitAddress, taskName, taskInformation, numberOfWorkers, taskReward) {

  console.log("Setting task Information process starting...");

  try {
    const taskInitContract = new ethers.Contract(taskInitAddress, taskInitAbi, wallet);
    const estimatedGas = await taskInitContract.estimateGas.setTask_Information(taskName, taskInformation, numberOfWorkers, taskReward);

    const result = await taskInitContract.setTask_Information(taskName, taskInformation, numberOfWorkers, taskReward, {
      gasLimit: estimatedGas.mul(2),
    });
    await result.wait();
    console.log("Task data successfully stored on the blockchain!")
  } catch(error) {
        console.error("Something went wrong with task initialization", error);

  }

}

async function callGetTaskInformation(taskInitAddress, taskId) {
  console.log("Get task information process started...");

  try {
    const taskInitContract = new ethers.Contract(taskInitAddress, taskInitAbi, provider);

    const result = await taskInitContract.getTaskInformation(taskId);
    console.log(result)
  } catch(error) {
    console.error("Something went wrong", error);
  }
}

async function callSelectWorker(taskSelectAddress) {
  console.log("Worker Selection for tasks started...");

  try {
    const taskSelectContract = new ethers.Contract(taskSelectAddress, taskSelectAbi, wallet);
    const estimatedGas = await taskSelectContract.estimateGas.Select_Worker();

    const result = await taskSelectContract.Select_Worker( {
      gasLimit: estimatedGas.mul(2),
    });
    await result.wait();
    console.log("Worker Selection completed successfully.")
  } catch (error) {
      console.error("Something went wrong ", error)
  }
}

async function callSubmitting_Data(taskSelectAddress, taskId, dataHash){
  console.log("Submitting data hash...");
  try {
    const taskSelectContract = new ethers.Contract(taskSelectAddress, taskSelectAbi, wallet);
    const estimatedGas = await taskSelectContract.estimateGas.Submitting_Data(taskId, dataHash);

    const result = await taskSelectContract.Submitting_Data(taskId, dataHash, {
      gasLimit: estimatedGas.mul(2),
    });
    await result.wait();
    console.log("Data submitted successfully.");
  } catch (error) {
    console.error("Something went wrong ", error)
  }
}

async function calculateQuality(taskSelectAddress, rewardSysAddress, taskId){
  // get the data hashes of the data sent by workers for a specific task

  let dataHashArray;

  try {
    console.log("Getting data hashes for selected task");
    const taskSelectContract = new ethers.Contract(taskSelectAddress, taskInitAbi, provider);

    dataHashArray = await taskSelectContract.getDataHashForTask(taskId);
    console.log(result)
  }catch(error) {
    console.error("Error returning data hashes: ", error)
  }

  // get the actual data from ipfs using the hash

  let dataArray = [];

  for(let i = 0; i < dataHashArray.length; i++) {
    dataArray.push(getFile(helia, dataHashArray[i]))
  }

  // run the data through data quality formula

  const result = findSmallestDifference(dataArray);
  console.log(result.numbers[0], result.numbers[1]);

  const validData = validPointsArray(result.numbers[0], result.numbers[1], dataArray);

  console.log("Data accepted: ", validData.validData);
  console.log("Congratulations, you are rewarded: ", validData.validIndexes);
  console.log("Penalized: ", validData.nonValidIndexes);

  // workers who's data was accepted from quality formula are rewarded

  // the rest are penalized

  // call reward contract to give rewards / penalties (give specific taskId + indexes of workers accepted/denied)
}

const deployUserContract = async (userName, userLocation, userId) => {
 const userConAddress = await deployUserInformation();
 await callSetUserInformation(userConAddress, userName, userLocation);
 await callGetUserInformation(userConAddress, userId);
};

deployUserContract("Melina", "Athens", "0").catch(console.error);