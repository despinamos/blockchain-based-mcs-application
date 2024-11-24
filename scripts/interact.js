const { ethers } = require("hardhat"); // Use for runtime

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
    const TaskSelectionProcess = await ethers.getContractFactory('Task_Selection_Process');
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

async function userRegistration(userInfo) {
    try {
        const userName = "Melina";
        const userReg = await userInfo.setUser_Information(userName);
        await userReg.wait(); // Wait for transaction confirmation
        const userData = await userInfo.getUserInformation(0);
        console.log("User Name and Reputation: ", userData);
    } catch (error) {
        console.error('Error reading data:', error);
    }
}

async function taskInformation(taskInit) {
    try {
        const taskInfo = await taskInit.setTask_Information(("Kick ball"), ("Just kick the ball"), 10, 100);
        const taskData = await taskInit.getTaskInformation(0);
        console.log("Task Name and Information: ", taskData);
    } catch (error) {
        console.error('Error reading data:', error);
    }
}

async function workerSelection(taskSelect) {

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
        
        var workerNumber = taskInfo.getWorkerCount();

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
}

async function main() {
    const { userInfo, taskInit } = await deploy();
    await userRegistration(userInfo);
    await taskInformation(taskInit);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
});
