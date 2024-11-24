// SPDX-License-Identifier: Unlicense


//@dev Despoina Moschokarfi 1516
//@dev Eleni Maria Oikonomou 1529

//Note: The is the last contract. It inherits both files, 'User_Related.sol' and 'Task_Related.sol'

//Setting compiler version, ranging from 0.7.0 to 0.9.0
pragma solidity >=0.7.0 <0.9.0;

//We import the necessary data from the parent contracts which currently are in order : UserInformation, Task_Initialization and Task_Selection_Process
import './Task_Related.sol';

contract Reward_Penalty_System is UserInformation, Task_Initialization{


    function Reward_Process() public{
        //pass
        Reputation_Score_Update();
    }

    //We tested the quality of the data and depending of how insufficient the data is, we give a greater the penalty
    function Penalty_Process() public {
        //Here we take the given data and we check how below of the sufficient quality percentage they are. The lower they are, the higher the penalty percentage.
        //pass
        //Emit task ID has been cancelled ...And call function for Reputation
        Reputation_Score_Update();

    }


    
    //We also add to the reputation score
    function Reputation_Score_Update() public {
        //Calculating the users's reputation by using the cancelled and completed requests
            //uint  rep = users[user_ID].reputation - users[user_ID].cancelled_tasks * 5 + users[user_ID].completed_tasks * 10;
            //users[user_ID].reputation = rep;
    }
}