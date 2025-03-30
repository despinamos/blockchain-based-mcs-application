var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

let provider;

if(typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(url);
}

const privateKey = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";
const wallet = new ethers.Wallet(privateKey, provider);

const { abi: userAbi} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json")
const { bytecode: userBytecode} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json");

const deployUserInformation = async (userName, userLocation) => {
  console.log("Deploying User Information contract...")

  const userFactory = new ethers.ContractFactory(userAbi, userBytecode, wallet);
  const userContract = await userFactory.deploy();

  console.log('Transaction hash: ', userContract.deployTransaction.hash)


  await userContract.deployTransaction.wait();

  console.log("Contract deployed at:", userContract.address);

  const userConAddress = userContract.address;


  console.log("Registering new User process started...");

  try {
    const userContract = new ethers.Contract(userConAddress, userAbi, wallet);
    const estimatedGas = await userContract.estimateGas.setUser_Information(userName, userLocation);

    const result = await userContract.setUser_Information(userName, userLocation, {
      gasLimit: estimatedGas.mul(290).div(100),
    });
    await result.wait();
    console.log("Data successfully stored on the blockchain!")
  } catch(error) {
        console.error("Something went wrong", error);

  }
}


const deployUserContract = async (userName, userLocation) => {
  await deployUserInformation(userName, userLocation);
};

deployUserContract("Melina", "Athens").catch(console.error);