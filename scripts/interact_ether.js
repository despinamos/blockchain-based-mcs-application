var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

let provider;

if(typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(url);
}

const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(privateKey, provider);

const { abi: userAbi} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json")

const { abi: taskInitAbi} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json")

const { abi: taskSelectAbi } = require("../artifacts/contracts/Task_Selection.sol/Task_Selection.json")

const { abi: rewardSysAbi } = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json")

// const userContractWithProvider = new ethers.Contract("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", userAbi, provider)
// const userContractWithSigner = new ethers.Contract("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", userAbi, wallet)

async function callSetUserInformation(userName, userLocation) {
  console.log("Registering new User process started...");

  try {
    const userContract = new ethers.Contract("0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f", userAbi, wallet);
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

async function callGetUserInformation(userId) {
  console.log("Return User info process started...");

  try {
    const userContract = new ethers.Contract("0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f", userAbi, provider)
    const result = await userContract.getUserInformation(userId);
    console.log(result)
  } catch(error) {
    console.error("Something went wrong", error);
  }
}

function findSmallestDifference(dataArray) {
  if (dataArray.length < 2) {
      return "Array must have at least two numbers";
  }

  let minDiff = Infinity;
  let num1, num2;

  // Compare every pair of numbers
  for (let i = 0; i < dataArray.length; i++) {
      for (let j = i + 1; j < dataArray.length; j++) {
          let diff = Math.abs(dataArray[i] - dataArray[j])
          if (diff < minDiff) {
              minDiff = diff;
              num1 = dataArray[i];
              num2 = dataArray[j];
          }
      }
  }

  return { difference: minDiff, numbers: [num1, num2] };
}

function validPointsArray(num1, num2, dataPoints) {
  let validData = [] //data
  let validIndexes = [] //indexes of accepted workers
  let nonValidIndexes = [] //indexes of denied workers

  let averageMostSimilar = Math.abs(( num1 + num2 ) / 2)
  console.log('average most similar: ', averageMostSimilar)

  for (let i = 0; i < dataPoints.length; i++) {
    if((dataPoints[i] > averageMostSimilar - 2) && (dataPoints[i] < averageMostSimilar + 2)) {
    validData.push(dataPoints[i])
    validIndexes.push(i)
    } else {
      nonValidIndexes.push(i)
    }
  }

  return { validData: validData, validIndexes: validIndexes, nonValidIndexes: nonValidIndexes}
}

const interact = async () => {
  await callSetUserInformation('John Doe', 'New York');
};

interact().catch(console.error);