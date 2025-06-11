// SPDX-License-Identifier: Unlicense

//@dev Despoina Moschokarfi 1516
//@dev Eleni Maria Oikonomou 1529

pragma solidity >=0.7.0 <0.9.0;

//We import the necessary data from the parent contract: Task_Initialization.sol
import './Task_Initialization.sol';

contract Reward_Penalty_System is Task_Initialization{

    //Created the function to demonstrate the logic of the reward system
    function Reward_Process(uint256 user_ID) public payable {
        (bool sent, ) = users[user_ID].user_address.call{value: msg.value}("");
        require(sent, "Failed to send Reward");
        Reputation_Score_Update( user_ID, 1, 0);
    }

    //Created the function to demonstrate the logic of the penalty system
    function Penalty_Process(uint256 user_ID) public {
       Reputation_Score_Update(user_ID, 0, 1);

    }
    
    //Updating User's Resutation
    function Reputation_Score_Update(uint256 user_ID, uint256 reward, uint256 penalty) public {
        //Local Variable to Store New Reputation
        uint256  rep;
        //Check the results provided by function 'Result_after_Calculation' in Contract 'Task_Selection.sol'
        if (reward == 1) {
           users[user_ID].completed_tasks++;
           rep = users[user_ID].reputation + 5;

        }else if (penalty == 1){
           rep = users[user_ID].reputation - 5;
        }

        //Update User's reputation and check if limit of tasks changes.
        users[user_ID].reputation = rep;
        Arrange_Limit(user_ID);
    }
    
    //Reduce User's Reputation as Penalty for:
    // Worker - Cancelling their participation in a task
    // Requester - Cancelling their task with at least one Worker participating in it.
    function Cancel_Penalty_Reputation(uint256 user_ID) public {
        uint256  rep = users[user_ID].reputation - 5;
        users[user_ID].reputation = rep;
        Arrange_Limit(user_ID);
    }

}