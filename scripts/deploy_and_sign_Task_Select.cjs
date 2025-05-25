var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

let provider;

if(typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(url);
}

const privateKey = "ACCOUNT_PRIVATE_KEY";
const wallet = new ethers.Wallet(privateKey, provider);

const { abi: taskSelectAbi } = require("../artifacts/contracts/Task_Selection.sol/Task_Selection.json")

const { bytecode: taskSelectBytecode } = require("../artifacts/contracts/Task_Selection.sol/Task_Selection.json")

//Function for contract deployment
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

const iface = new ethers.utils.Interface(taskSelectAbi);

// User Information functions
const dataSetUserInfo = iface.encodeFunctionData("setUser_Information", ["Anna", "Athens"]);
//console.log("Set User Info data:", dataSetUserInfo);

const dataGetUserInfo = iface.encodeFunctionData("getUserInformation", [1]);
//console.log("Get User Info data: ", dataGetUserInfo);

// Task Initialization functions
const dataSetTaskInfo = iface.encodeFunctionData("setTask_Information", ["Weather", "Check Weather", 3, 5, 100]);
//console.log("Set User Info data:", dataSetUserInfo);

const dataGetTaskInfo = iface.encodeFunctionData("getTaskInformation", [1]);
//console.log("Get Task Info data: ", dataGetTaskInfo);

//Reward Penalty System functions
// const dataRewardProcess = iface.encodeFunctionData("Reward_Process", userId, taskId);

// const dataPenaltyProcess = iface.encodeFunctionData("Reward_Process", userId);

// const dataReputationScoreUpdate = iface.encodeFunctionData("Reward_Process", userId, reward, penalty);

// Task Select functions
const dataTableTaskRequester = iface.encodeFunctionData("Table_Task_Requester", );
console.log("Table Task Requester, ", dataTableTaskRequester);

const dataTableTaskWorker = iface.encodeFunctionData("Table_Task_Worker", );
console.log("Table Task Worker, ", dataTableTaskWorker);

const dataSelectWorker = iface.encodeFunctionData("Select_Worker", );

async function send() {
  // const taskSelectConAddress = await deployTaskSelection();
  // console.log("Task Selection contract address: ", taskSelectConAddress)
  // const nonce = await provider.getTransactionCount(wallet.address);
  // const gasPrice = await provider.getGasPrice();

  // const tx = {
  //   to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  //   data: dataSelectWorker,
  //   nonce,
  //   gasLimit: 10000000,
  //   gasPrice
  // }

  // const response = await wallet.signTransaction(tx);
  // console.log("Raw Transaction: ", response);
  const encodedResult = "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000039204e616d653a2057656174686572202d20496e666f726d6174696f6e3a20436865636b2057656174686572202d205265776172643a2031303000000000000000";
  const decoded = iface.decodeFunctionResult("Table_Task_Worker", encodedResult);
  console.log(decoded);
}

send();