var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

let provider;

if(typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(url);
}

const privateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
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

const dataTableTaskRequester = iface.encodeFunctionData("Table_Task_Requester", );

const dataTableTaskWorker = iface.encodeFunctionData("Table_Task_Worker", );

async function send() {
  // const taskSelectConAddress = await deployTaskSelection();
  // console.log("Task Selection contract address: ", taskSelectConAddress)
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
  // const encodedResult = "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000075472616666696300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d436865636b207472616666696300000000000000000000000000000000000000";
  // const decoded = iface.decodeFunctionResult("getTaskInformation", encodedResult);
  // console.log(decoded);
}

send();