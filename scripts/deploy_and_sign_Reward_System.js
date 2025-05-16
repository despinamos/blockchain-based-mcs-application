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

const { abi: rewardSysAbi } = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json")

const { bytecode: rewardSysBytecode } = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json")

//Function for contract deployment
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

const iface = new ethers.utils.Interface(rewardSysAbi);

const dataRewardProcess = iface.encodeFunctionData("Reward_Process", userId, taskId);

const dataPenaltyProcess = iface.encodeFunctionData("Reward_Process", userId);

const dataReputationScoreUpdate = iface.encodeFunctionData("Reward_Process", userId, reward, penalty);

async function send() {
  // const rewardSysConAddress = await deployRewardPenaltySystem();
  // console.log("Reward Penalty System contract address: ", rewardSysConAddress)
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