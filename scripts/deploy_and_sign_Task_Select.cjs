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
const dataSetTaskInfo = iface.encodeFunctionData("setTask_Information", ["Weather", "Check Weather", 4, 100]);
//console.log("Set User Info data:", dataSetUserInfo);

const dataGetTaskInfo = iface.encodeFunctionData("getTaskInformation", [1]);
//console.log("Get Task Info data: ", dataGetTaskInfo);

// Task Select functions
const dataTableTaskRequester = iface.encodeFunctionData("Table_Task_Requester", );
//console.log("Table Task Requester, ", dataTableTaskRequester);

const dataTableTaskWorker = iface.encodeFunctionData("Table_Task_Worker", );
//console.log("Table Task Worker, ", dataTableTaskWorker);

const dataTaskCancelledByWorker = iface.encodeFunctionData("Task_Cancelled_By_Worker", [1]);

const dataSelectWorker = iface.encodeFunctionData("Select_Worker", );

const dataResultSetByRequester = iface.encodeFunctionData("Result_Set_by_Requester", [1, 3, 1]);

const dataResultAfterCalculation = iface.encodeFunctionData("Result_after_Calculation", [1]);

async function send() {
  // const taskSelectConAddress = await deployTaskSelection();
  // console.log("Task Selection contract address: ", taskSelectConAddress)
  const nonce = await provider.getTransactionCount(wallet.address);
  const gasPrice = await provider.getGasPrice();

  const tx = {
    to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    data: dataResultAfterCalculation,
    nonce,
    gasLimit: 10000000,
    gasPrice
  }

  const response = await wallet.signTransaction(tx);
  console.log("Raw Transaction: ", response);
  // const encodedResult = "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002257656174686572202d20436865636b2057656174686572202d205265736572766564000000000000000000000000000000000000000000000000000000000000";
  // const decoded = iface.decodeFunctionResult("Table_Task_Requester", encodedResult);
  // console.log(decoded);
}

send();