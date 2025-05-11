var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

let provider;

if(typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(url);
}

const privateKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
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

const dataSetUserInfo = iface.encodeFunctionData("setUser_Information", ["Alice", "Wonderland"]);
//console.log("Set User Info data:", dataSetUserInfo);

const dataGetUserInfo = iface.encodeFunctionData("getUserInformation", [2]);
//console.log("Get User Info data: ", dataGetUserInfo);

async function send() {
  // const userConAddress = await deployUserInformation();
  // console.log("UserInformation contract address: ", userConAddress)
  // const nonce = await provider.getTransactionCount(wallet.address);
  // const gasPrice = await provider.getGasPrice();

  // const tx = {
  //   to: "0x850EC3780CeDfdb116E38B009d0bf7a1ef1b8b38",
  //   data: dataSetUserInfo,
  //   nonce,
  //   gasLimit: 10000000,
  //   gasPrice
  // }

  // const response = await wallet.signTransaction(tx);
  // console.log("Raw Transaction: ", response);
  // const encodedResult = "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001000000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000005416c696365000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a576f6e6465726c616e6400000000000000000000000000000000000000000000";
  // const decoded = iface.decodeFunctionResult("getUserInformation", encodedResult);
  // console.log(decoded);
}

send();