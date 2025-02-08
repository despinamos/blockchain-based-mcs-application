const { Web3 }= require('web3');
const web3 = new Web3('http://127.0.0.1:8545/');

const { abi: userAbi} = require("../../artifacts/contracts/UserInformation.sol/UserInformation.json");

const userJson = require("../../artifacts/contracts/UserInformation.sol/UserInformation.json");

// Ensure correct bytecode extraction
const userBytecode = userJson.bytecode || userJson.evm?.bytecode?.object;

if (!userBytecode || typeof userBytecode !== 'string' || !userBytecode.startsWith("0x")) {
    throw new Error("Invalid bytecode format in JSON file");
}

console.log("Bytecode: ", userBytecode)
console.log("Bytecode type:", typeof userBytecode);

const userContract = new web3.eth.Contract(userAbi);
userContract.handleRevert = true;

async function deploy() {
	const providersAccounts = await web3.eth.getAccounts();
	const defaultAccount = providersAccounts[0];
	console.log('Deployer account:', defaultAccount);

	const userContractDeployer = userContract.deploy({
		data: userBytecode,
		arguments: [1],
	})

	const userGas = await userContractDeployer.estimateGas({
		from: defaultAccount,
	});
	console.log('Estimated gas:', userGas);

	try {
		const tx = await userContractDeployer.send({
			from: defaultAccount,
			userGas,
			gasPrice: 10000000000,
		});
		console.log('User contract deployed at address: ' + tx.options.address);
		
	} catch (error) {
		console.error(error);
	}
}

deploy();