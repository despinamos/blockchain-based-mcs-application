const { Web3 } = require('web3');

// Use window.ethereum if in a browser, otherwise connect to localhost
let web3;
if (typeof window !== "undefined" && window.ethereum) {
    web3 = new Web3(window.ethereum);
} else {
    web3 = new Web3('http://127.0.0.1:8545/');
}

const { abi: userAbi} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json")

const { abi: taskInitAbi} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json")

const { abi: taskSelectAbi } = require("../artifacts/contracts/Task_Selection.sol/Task_Selection.json")

const { abi: rewardSysAbi } = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json")

const { bytecode: userBytecode} = require("../artifacts/contracts/UserInformation.sol/UserInformation.json");

const { bytecode: taskInitBytecode} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json")

const { bytecode: taskSelectBytecode } = require("../artifacts/contracts/Task_Selection.sol/Task_Selection.json")

const { bytecode: rewardSysBytecode } = require("../artifacts/contracts/Reward_Penalty_System.sol/Reward_Penalty_System.json")

// Create contract object for User Information

const userContract = new web3.eth.Contract(userAbi);
userContract.handleRevert = true;

// Create contract object for Task Initialization

const taskInitContract = new web3.eth.Contract(taskInitAbi);
taskInitContract.handleRevert = true;

// Create contract object for User Information

const taskSelectContract = new web3.eth.Contract(taskSelectAbi);
taskSelectContract.handleRevert = true;

// Create contract object for User Information

const rewardSysContract = new web3.eth.Contract(rewardSysAbi);
rewardSysContract.handleRevert = true;

async function deployUserInformation() {
  const providersAccounts = await web3.eth.getAccounts()
  const defaultAccount = providersAccounts[0]
  console.log('Deployer account:', defaultAccount)

  const userContractDeployer = userContract.deploy({
    data: userBytecode
  })

  const userGas = await userContractDeployer.estimateGas({
    from: defaultAccount,
  })
  console.log('User Estimated gas:', userGas)

  try {
    const tx = await userContractDeployer.send({
      from: defaultAccount,
      userGas,
      gasPrice: 10000000000,
    })
    console.log('User contract deployed at address: ' + tx.options.address)

  } catch (error) {
    console.error(error)
  }

}

async function deployTaskInitialization() {
  const providersAccounts = await web3.eth.getAccounts()
  const defaultAccount = providersAccounts[0]
  //console.log('Deployer account:', defaultAccount)

  const taskInitContractDeployer = taskInitContract.deploy({
    data: taskInitBytecode
  })

  const taskInitGas = await taskInitContractDeployer.estimateGas({
    from: defaultAccount,
  })
  console.log('User Estimated gas:', taskInitGas)

  try {
    const tx = await taskInitContractDeployer.send({
      from: defaultAccount,
      taskInitGas,
      gasPrice: 10000000000,
    })
    console.log('Task Init contract deployed at address: ' + tx.options.address)

  } catch (error) {
    console.error(error)
  }

}

async function deployTaskSelection() {
  const providersAccounts = await web3.eth.getAccounts()
  const defaultAccount = providersAccounts[0]
  //console.log('Deployer account:', defaultAccount)

  const taskSelectContractDeployer = taskSelectContract.deploy({
    data: taskSelectBytecode
  })

  const taskSelectGas = await taskSelectContractDeployer.estimateGas({
    from: defaultAccount,
  })
  console.log('Task Select Estimated gas:', taskSelectGas)

  try {
    const tx = await taskSelectContractDeployer.send({
      from: defaultAccount,
      taskSelectGas,
      gasPrice: 10000000000,
    })
    console.log('Task Selection contract deployed at address: ' + tx.options.address)

  } catch (error) {
    console.error(error)
  }

}

async function deployRewardPenaltySystem() {
  const providersAccounts = await web3.eth.getAccounts()
  const defaultAccount = providersAccounts[0]
  //console.log('Deployer account:', defaultAccount)

  const rewardSysContractDeployer = rewardSysContract.deploy({
    data: rewardSysBytecode
  })

  const rewardSysGas = await rewardSysContractDeployer.estimateGas({
    from: defaultAccount,
  })
  console.log('Reward sys Estimated gas:', rewardSysGas)

  try {
    const tx = await rewardSysContractDeployer.send({
      from: defaultAccount,
      rewardSysGas,
      gasPrice: 10000000000,
    })
    console.log('Reward sys contract deployed at address: ' + tx.options.address)

  } catch (error) {
    console.error(error)
  }

}

deployUserInformation()
deployTaskInitialization()
deployTaskSelection()
deployRewardPenaltySystem()