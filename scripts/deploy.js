const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Deploy UserInformation
    const First = await ethers.getContractFactory('UserInformation');
    const first = await First.deploy();
    await first.waitForDeployment();
    console.log( "User_Information deployed at: ",await first.getAddress());

    //Execute function SetUserInformation
    const User_Registration = await first.setUser_Information('Melina');
    const getUserInformation = await first.getUserInformation(0);
    console.log("User Name and Reputation: ", await first.getUserInformation(0));

    // Deploy Task_Initialization
    const Second = await ethers.getContractFactory('Task_Initialization');
    const second = await Second.deploy();
    await second.waitForDeployment();
    console.log( "Task_Initialization deployed at: ", await second.getAddress() ); 

    //Execute function setTask_Information
    const Task_Info = await second.setTask_Information(("Kick ball"), ("Just kick the ball"), 10, 100);
    const getTaskInformation = await second.getTaskInformation(0);
    console.log("Task Name and Information: ", await second.getTaskInformation(0));

    // Deploy Task_Selection_Process
    const Third = await ethers.getContractFactory('Task_Selection_Process');
    const third = await Third.deploy();
    await third.waitForDeployment();
    console.log( "Task_Selection_Process deployed at: ", await third.getAddress())
   
    // Deploy Reward_penalty_System
    const Fourth = await ethers.getContractFactory('Reward_Penalty_System');
    const fourth = await Fourth.deploy();
    await fourth.waitForDeployment();
    console.log( "Reward_Penalty_System deployed at: ", await fourth.getAddress());
}
main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})