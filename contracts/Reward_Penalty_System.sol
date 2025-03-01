// SPDX-License-Identifier: Unlicense

//@dev Despoina Moschokarfi 1516
//@dev Eleni Maria Oikonomou 1529

//Note: The is the last contract. It inherits both files, 'User_Related.sol' and 'Task_Related.sol'

//Setting compiler version, ranging from 0.7.0 to 0.9.0
pragma solidity >=0.7.0 <0.9.0;

//We import the necessary data from the parent contracts which currently are in order : UserInformation, Task_Initialization and Task_Selection_Process
import './Task_Initialization.sol';

contract Reward_Penalty_System is Task_Initialization{


    function Reward_Process(uint256 user_ID, uint256 _unique_taskid) public payable {
        //Reward = 1 - Penalty = 0
        // transfer tasks[_unique_taskid].reward to users[user_ID].user_address wallet
        (bool sent, ) = users[user_ID].user_address.call{value: tasks[_unique_taskid].reward}("");
        require(sent, "Failed to send Reward");
        Reputation_Score_Update( user_ID, 1, 0);
    }

    //We tested the quality of the data and depending of how insufficient the data is, we give a greater the penalty
    function Penalty_Process(uint256 user_ID) public {
        //Here we take the given data and we check how below of the sufficient quality percentage they are. The lower they are, the higher the penalty percentage.
        //pass
        //Emit task ID has been cancelled ...And call function for Reputation

        //Amazing!! We have a penalty of 1 and a reward of 0 for the user who has been penalized for the task he/she has cancelled  :(
       Reputation_Score_Update(user_ID, 0, 1);

    }


    
    //We also add to the reputation score
    function Reputation_Score_Update(uint256 user_ID, uint256 reward, uint256 penalty) public {
        //Calculating the users's reputation by using the cancelled and completed requests
            uint256  rep = users[user_ID].reputation - users[user_ID].cancelled_tasks * 5 + users[user_ID].completed_tasks * 10 + reward - penalty;
            users[user_ID].reputation = rep;
            Arrange_Limit(user_ID);
    }
    
}