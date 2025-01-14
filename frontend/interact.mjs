import pkg from 'hardhat';
const { ethers } = pkg;
import { createHeliaHTTP } from '@helia/http'
import { unixfs } from '@helia/unixfs'

async function initIpfs() {
    const helia = await createHeliaHTTP();
    console.log("IPFS Node created");
}

async function uploadFile(taskId, file) {
    const files = [{ path: file.name + file.path, content: file }];

    const fs = unixfs(helia);

    const readmeCid = await fs.addFile(file);

    console.log("File added ", readmeCid.toString());

    const cid = await fs.addBytes(encoder.encode('Hello World 101'), {
        onProgress: (evt) => {
          console.info('add event', evt.type, evt.detail)
        }
      })
      
        console.log('Added file:', cid.toString())

        await setCidToContract(taskId, cid.toString);
        console.log("Cid submitted to smart contract.")
}

async function setCidToContract(taskId, hash) {
    const submitData = taskSelect.connect(defaultProvider.getSigner());
    await submitData.Submitting_Data(taskId, hash);
    setIpfsHash(hash);
}

async function deploy() {
    // contract deployment
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Deploy UserInformation
    const UserInformation = await ethers.getContractFactory('UserInformation');
    const userInfo = await UserInformation.deploy();
    await userInfo.waitForDeployment();
    console.log("User_Information deployed at: ", await userInfo.getAddress());

    // Deploy Task_Initialization
    const TaskInitialization = await ethers.getContractFactory('Task_Initialization');
    const taskInit = await TaskInitialization.deploy();
    await taskInit.waitForDeployment();
    console.log("Task_Initialization deployed at: ", await taskInit.getAddress());

    // Deploy Task_Selection_Process
    const TaskSelectionProcess = await ethers.getContractFactory('Task_Selection');
    const taskSelect = await TaskSelectionProcess.deploy();
    await taskSelect.waitForDeployment();
    console.log("Task_Selection_Process deployed at: ", await taskSelect.getAddress());

    // Deploy Reward_penalty_System
    const RewardPenaltySystem = await ethers.getContractFactory('Reward_Penalty_System');
    const rewardSys = await RewardPenaltySystem.deploy();
    await rewardSys.waitForDeployment();
    console.log("Reward_Penalty_System deployed at: ", await rewardSys.getAddress());
    
    return { userInfo, taskInit, taskSelect, rewardSys };
}

async function userFormSubmission(userInfo) {
    // Form Submission
    
        const name = document.getElementById("username").value;
    
        if (!name) {
        alert("Please fill in all fields");
        return;
        }
    
        try {
        const accounts = await web3.eth.requestAccounts(); // Request user's wallet accounts
    
        // Interact with the contract
        
        // userRegistration.methods.setUser_Information(name).send({
        //     from: accounts[0],
        // });

        const userReg = await userInfo.setUser_Information(name);
        await userReg.wait();
    
        alert("Data successfully stored on the blockchain!");
        } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting data.");
        }
}

async function userRegistration(userInfo) {

    try {
        const userName = "Melina";
        // const userLocationLatitude = cloakedLatitude;
        // const userLocationLongitude = cloakedLongitude;
        const userReg = await userInfo.setUser_Information(userName);
        await userReg.wait(); // Wait for transaction confirmation
        const userData = await userInfo.getUserInformation(0);
        console.log("User Name and Reputation: ", userData);
    } catch (error) {
        console.error('Error during user registration: ', error);
    }
}

async function taskInformation(taskInit, taskName, taskInf, workerAmount, workerReward) {
    try {
        const taskInfo = await taskInit.setTask_Information(taskName, taskInf, workerAmount, workerReward);
        const taskData = await taskInit.getTaskInformation(0);
        console.log("Task Name and Information: ", taskData);
    } catch (error) {
        console.error('Error during task registration: ', error);
    }
}

async function workerSelection(taskSelect) {
    try {
        const workerSelected = await taskSelect.Select_Worker();
    console.log("Worker selection process...");
    } catch (error) {
        console.error('Error during worker selection for task: ', error);
    }
}

async function submitData(taskId, file) {
    try {
        //on click the data of the user will be captured and sent to ipfs. only the cid will be kept.
        // dataHash will be the cid.
        uploadFile(taskId, file)
        console.log("Data submission successful...");
    } catch (error) {
        console.error('Error submitting data: ', error);
    }
}

async function calculateQuality() {
    /* > Call function to get data submitted by a worker for a task.
    > This data is accessed from IPFS.  
    > The data is evaluated by the data quality formula. 
    > The result is saved on the blockchain.
    > According to that result, the worker's reputation is updated.
    > When all workers who have submitted data for a certain task are evaluated, the reward is sent to them.
    > If the data quality fails the evaluation, the worker takes a penalty. */

        var ethers = require('ethers');

        // var provider = new ethers.providers.JsonRpcProvider("YOUR_QUICKNODE_ENDPOINT");
        // var contractAddress = "CONTRACT_ADDRESS_FROM_REMIX";
        // var abi = [
        //     {
        //         "inputs": [
        //             {
        //                 "internalType": "string",
        //                 "name": "x",
        //                 "type": "string"
        //             }
        //         ],
        //         "name": "sendHash",
        //         "outputs": [],
        //         "stateMutability": "nonpayable",
        //         "type": "function"
        //     },
        //     {
        //         "inputs": [],
        //         "name": "getHash",
        //         "outputs": [
        //             {
        //                 "internalType": "string",
        //                 "name": "",
        //                 "type": "string"
        //             }
        //         ],
        //         "stateMutability": "view",
        //         "type": "function"
        //     }
        // ];

        // var contract = new ethers.Contract(contractAddress, abi, provider);

        /* >Get how many Workers have been assigned to a Task by getting the number of the Workers from Task Information.
        >Get all data sent by Workers for a certain Task. Compare them all with each other inside a loop using the SenseChain formula. 
        >Blockchain only has the data hash, so we need to get the data from IPFS according to that hash. */

        const workerDataHashes = [];
        
        var workerNumber = taskInit.getWorkerCount();

        for (let step = 0; step < workerNumber; step++) {
            workerDataHashes.push(taskSelect.getDataHashForTask(task_id, worker_id));
            console.log("Worker data hash sent...");
          }

        // function getHashFromContract() {
        //     return contract.getHash()
        //         .then(function(hash) {
        //             return hash;
        //         })
        //         .catch(function(error) {
        //             console.error('Error fetching hash from contract:', error);
        //         });
        // }

        // document.addEventListener('DOMContentLoaded', function() {
        //     getHashFromContract().then(function(hash) {
        //         if (hash) {
        //             document.getElementById("btn").addEventListener('click', function() {
        //                 window.location.href = "https://ipfs.io/ipfs/" + hash;
        //             });
        //         }
        //     });
        // });

        var result = dataQualityFormula(data);

        try {
            const result = await taskSelect.setWorkerQuality(taskId, workerId, result);
            console.log("Submitted calculation result...");
        } catch (error) {
            console.error('Error submitting calculation result:', error);
        }


}

async function main() {
    const { userInfo, taskInit } = await deploy();
    // await userRegistration(userInfo);
    // await taskInformation(taskInit, "Kick ball!", "Just kick the ball!", 10, 100);
    document.getElementById("dataForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        await userFormSubmission(userInfo);
    });
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
});
