var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

let provider;

if(typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(url);
}

const privateKey = "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897";
const wallet = new ethers.Wallet(privateKey, provider);

const { abi: userAbi} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json")

const { bytecode: userBytecode} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json")

// Contract Deployment
// Functions return the address of the deployed contract

const deployUserInformation = async () => {
  console.log("Deploying User Information contract...")

  const userFactory = new ethers.ContractFactory(userAbi, userBytecode, wallet);
  const userContract = await userFactory.deploy();

  console.log('Transaction hash for UserInformation: ', userContract.deployTransaction.hash)

  await userContract.deployTransaction.wait();

  console.log("Contract deployed at:", userContract.address);

  const userConAddress = userContract.address;

  return userConAddress;
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

const iface = new ethers.utils.Interface(userAbi);

const dataSetUserInfo = iface.encodeFunctionData("setUser_Information", ["anna", "Athens"]);
//console.log("Set User Info data:", dataSetUserInfo);

const dataGetUserInfo = iface.encodeFunctionData("getUserInformation", [3]);
//console.log("Get User Info data: ", dataGetUserInfo);

async function send() {
  // const userConAddress = await deployUserInformation();
  // console.log("UserInformation contract address: ", userConAddress)
  // const nonce = await provider.getTransactionCount(wallet.address);
  // const gasPrice = await provider.getGasPrice();

  // const tx = {
  //   to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  //   data: dataSetUserInfo,
  //   nonce,
  //   gasLimit: 10000000,
  //   gasPrice
  // }

  // const response = await wallet.signTransaction(tx);
  // console.log("Raw Transaction: ", response);
  const encodedResult = "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000010000000000000000000000000090f79bf6eb2c4f870365e785982e1f101e93b906000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000007436861726c69650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064c6f6e646f6e0000000000000000000000000000000000000000000000000000";
  const decoded = iface.decodeFunctionResult("getUserInformation", encodedResult);
  console.log(decoded);
}

send();