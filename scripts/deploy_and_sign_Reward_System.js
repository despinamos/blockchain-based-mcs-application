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