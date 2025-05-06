var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

let provider;

if(typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(url);
}

const privateKey = "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0";
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

const dataSetUserInfo = iface.encodeFunctionData("setUser_Information", ["Bob", "New York"]);
//console.log("Set User Info data:", dataSetUserInfo);

const dataGetUserInfo = iface.encodeFunctionData("getUserInformation", [0]);
//console.log("Get User Info data: ", dataGetUserInfo);

async function send() {
//  const userConAddress = await deployUserInformation();
//  console.log("UserInformation contract address: ", userConAddress)
  // const nonce = await provider.getTransactionCount(wallet.address);
  // const gasPrice = await provider.getGasPrice();

  // const tx = {
  //   to: "0x17F24D3b8Bc1150553b54Da30B4d993AcB889212",
  //   data: dataSetUserInfo,
  //   nonce,
  //   gasLimit: 10000000,
  //   gasPrice
  // }

  // const response = await wallet.signTransaction(tx);
  // console.log("Raw Transaction: ", response);
  const encodedResult = "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000005416c696365000000000000000000000000000000000000000000000000000000";
  const decoded = iface.decodeFunctionResult("getUserInformation", encodedResult);
  console.log(decoded);
}

send();