var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

let provider;

if(typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(url);
}

const privateKey = "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba";
const wallet = new ethers.Wallet(privateKey, provider);

const { abi: taskInitAbi} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json")

const { bytecode: taskInitBytecode} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json")

//Function for Contract deployment
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

const iface = new ethers.utils.Interface(taskInitAbi);

const dataSetTaskInfo = iface.encodeFunctionData("setTask_Information", ["Traffic", "Check traffic", 6, 3, 10]);
//console.log("Set User Info data:", dataSetUserInfo);

const dataGetTaskInfo = iface.encodeFunctionData("getTaskInformation", [1]);
//console.log("Get Task Info data: ", dataGetTaskInfo);

async function send() {
  // const taskInitConAddress = await deployTaskInitialization();
  // console.log("Task Initialization contract address: ", taskInitConAddress)
  // const nonce = await provider.getTransactionCount(wallet.address);
  // const gasPrice = await provider.getGasPrice();

  // const tx = {
  //   to: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  //   data: dataSetTaskInfo,
  //   nonce,
  //   gasLimit: 10000000,
  //   gasPrice
  // }

  // const response = await wallet.signTransaction(tx);
  // console.log("Raw Transaction: ", response);
  const encodedResult = "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000075472616666696300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d436865636b207472616666696300000000000000000000000000000000000000";
  const decoded = iface.decodeFunctionResult("getTaskInformation", encodedResult);
  console.log(decoded);
}

send();