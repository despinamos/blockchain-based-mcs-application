const { Web3 } = require('web3');

// Use window.ethereum if in a browser, otherwise connect to localhost
let web3;
if (typeof window !== "undefined" && window.ethereum) {
    web3 = new Web3(window.ethereum);
} else {
    web3 = new Web3('http://127.0.0.1:8545/');
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

async function setUserInformation(userContract, userName, userLocation) {

  const providersAccounts = await web3.eth.getAccounts()
  const defaultAccount = providersAccounts[0]
  console.log('Interact account:', defaultAccount)

  try {

    // Interact with the user contract
			// 		Register user
      const receipt = await userContract.methods.setUser_Information(userName, userLocation).send({
        from: defaultAccount,
        gas: 1000000,
        gasPrice: '10000000000',
      });
      console.log('Transaction Hash: ' + receipt.transactionHash);

  alert("Data successfully stored on the blockchain!");

  } catch (error) {
    console.error(error)
  }

}

async function getUserInformation(userContract, userId) {

  try {
     // Get user info
     const userInfo = await userContract.methods.getUserInformation(userId).call();
     console.log('User information: ' + userInfo);
  } catch (error) {
    console.error("Error while getting user info", error)
  }

}

async function setTaskInformation(taskInitContract, taskName, taskInfo, taskLocation, workersNum, reward) {

  const providersAccounts = await web3.eth.getAccounts()
  const defaultAccount = providersAccounts[0]
  console.log('Interact account:', defaultAccount)

  try {

    // Interact with the task init contract
			// 		Create task
      const receipt = await taskInitContract.methods.setTask_Information(taskName, taskInfo, taskLocation, workersNum, reward).send({
        from: defaultAccount,
        gas: 1000000,
        gasPrice: '10000000000',
      });
      console.log('Transaction Hash: ' + receipt.transactionHash);

  alert("Data successfully stored on the blockchain!");

  } catch (error) {
    console.error(error)
  }
}

async function getTaskInformation(taskInitContract, taskId) {
  try {
    // Get task info
    const taskInfo = await taskInitContract.methods.getTaskInformation(taskId).call()
    console.log('Task information: ' + taskInfo)
 } catch (error) {
   console.error("Error while getting task info", error)
 }
}

async function workerSelection(taskSelectContract) {
  try {
  console.log("Worker selection process...");
  const receipt = await taskSelectContract.methods.SelectWorker(taskId).send({
    from: defaultAccount,
    gas: 1000000,
    gasPrice: '10000000000',
  });
  console.log('Transaction Hash: ' + receipt.transactionHash)
} catch (error) {
    console.error('Error during worker selection: ', error)
}
}

async function submitData(taskSelectContract, taskId, dataHash) {
  try {
    console.log("Submit data process...");
  const receipt = await taskSelectContract.methods.Submitting_Data(taskId, dataHash).send({
    from: defaultAccount,
    gas: 1000000,
    gasPrice: '10000000000',
  });
  console.log('Transaction Hash: ' + receipt.transactionHash)
  } catch(error) {
    console.error("Error submitting data: ", error)
  }
}

async function calculateQuality(taskSelectContract, rewardSysContract, taskId) {
  // get the data hashes of the data sent by workers for a specific task

  try {
    console.log("Getting data hashes for selected task")
    const dataHashArray = await taskSelectContract.methods.getDataHashForTask(taskId).call()
  } catch(error) {
    console.error("Error returning data hashes: ", error)
  }

  // get the actual data from ipfs using the hash

  const dataArray = []

  for(let i = 0; i < dataHashArray.length; i++) {
    dataArray.push(getFile(helia, dataHashArray[i]))
  }

  // run the data through data quality formula

  const result = findSmallestDifference(dataArray)
  console.log(result.numbers[0], result.numbers[1])

  const validData = validPointsArray(result.numbers[0], result.numbers[1], dataArray)
  
  console.log("Data accepted: ", validData.validData)
  console.log("Congratulations, you are rewarded: ", validData.validIndexes)
  console.log("Penalized: ", validData.nonValidIndexes)

  // workers who's data was accepted from quality formula are rewarded

  // the rest are penalized

  // call reward contract to give rewards / penalties (give specific taskId + indexes of workers accepted/denied)
}