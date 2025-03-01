//SPDX-License-Identifier: Unlicense


//@dev Despoina Moschokarfi 1516
//@dev Eleni Maria Oikonomou 1529


//Note: This is the second and third contract. They both inherit the root contract in the User_Related.sol


//Setting compiler version, ranging from 0.7.0 to 0.9.0
pragma solidity >=0.7.0 <0.9.0;
//Importing the appropriate parent contracts from the corresponding files in order: UserInformation
import "./UserInformation.sol";


//A contract that creates a task with key values the task id and the requester's address, as long as the account is a requester's
contract Task_Initialization is UserInformation{

    
    //Status Code for the Task's process
    enum TaskStatus{
        Available,
        Reserved, 
        Cancelled,
        Completed
    }
    // Returns uint
    // Available - 0
    // Reserved - 1
    // Cancelled- 2
    // Completed - 3

    //Structured Data for Task's Creation
    struct taskCreation{
        address requester_address;
        string requester_name;
        string task_name;
        uint256 unique_taskid;
        string task_information;
        uint time;
        string location;
        TaskStatus status;
        int number_of_workers_limit;
        uint reward;
        //int[] task_data;
    }

    mapping(uint256 => taskCreation) internal tasks;

    uint256[] internal task_ids;
    //Setting a task's unique ID depending on the length of the array
    function Set_Task_Unique_ID() private view returns(uint256){
        return task_ids.length;
    }


    //Creating a function that sets and stores Task Information.
    function setTask_Information(string  memory _task_name, string memory _task_information, int _number_of_workers_limit, uint _reward) public {
        //Adding new task's Information with _unique_taskid playing the role of index.
        uint256 _unique_taskid = Set_Task_Unique_ID();
        uint256 get_UserID = userAddressToId[msg.sender];

        tasks[_unique_taskid] = taskCreation({
            requester_address: msg.sender,
            requester_name: users[get_UserID].full_name,
            unique_taskid: _unique_taskid,
            task_name: _task_name,
            task_information: _task_information,
            time: 7 days,
            location: users[get_UserID].location,
            status: set_status(),
            number_of_workers_limit: _number_of_workers_limit,
            reward: _reward
        });

        //Setting an array to keep track of the ids respectively
        task_ids.push(_unique_taskid);

        emit Task_Created(msg.sender, _task_name, _unique_taskid);
        
    }

    function getTaskInformation(uint256 _task_id) public view returns (string memory, string memory) {
        return (tasks[_task_id].task_name, tasks[_task_id].task_information);
    }
    
    //Event that a Task was created
    event Task_Created(address user_address, string task_name, uint256 unique_taskid);


    //Setting a default status for the created task
    function set_status() private pure returns (TaskStatus) {
        return TaskStatus.Available;
    }
    
}