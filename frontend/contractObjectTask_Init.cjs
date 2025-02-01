const  Web3  = require('web3');

// Use window.ethereum if in a browser, otherwise connect to localhost
let web3;
if (typeof window !== "undefined" && window.ethereum) {
    web3 = new Web3(window.ethereum);
} else {
    web3 = new Web3('http://127.0.0.1:8545/');
}

const { abi: taskInitAbi} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json");

const { bytecode: taskInitBytecode} = require("../artifacts/contracts/Task_Initialization.sol/Task_Initialization.json");

  
// Create contract object for User Information and Task Initialization
const taskInitContract = new web3.eth.Contract(taskInitAbi);
taskInitContract.handleRevert = true;


//task init deploy
window.deploy_Task = async function() {
  const providersAccounts = await web3.eth.getAccounts();
	const defaultAccount = providersAccounts[0];
	console.log('Deployer account:', defaultAccount);

	const taskContractDeployer = taskInitContract.deploy({
		data: taskInitBytecode
	})

	const taskInitGas = await taskContractDeployer.estimateGas({
		from: defaultAccount,
	})
	console.log('Task Init Estimated gas: ', taskInitGas)

	try {
		const txTask = await taskContractDeployer.send({
			from: defaultAccount,
			taskInitGas,
			gasPrice: 10000000000,
		});
		console.log('Task Initialization contract deployed at address: ' + txTask.options.address);

	} catch (error) {
		console.error(error);
	}
}