//SPDX-License-Identifier: Unlicense


//@dev Despoina Moschokarfi 1516
//@dev Eleni Maria Oikonomou 1529

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

    uint256 public nextTaskId = 1;

    mapping(uint256 => taskCreation) internal tasks;

    uint256[] public task_ids;
    //Setting a task's unique ID depending on the length of the array
    function Set_Task_Unique_ID() private view returns(uint256){
        return task_ids.length + 1;
    }


    //Creating a function that sets and stores Task Information.
    function setTask_Information(string  memory _task_name, string memory _task_information, uint _time, int _number_of_workers_limit, uint _reward) public {
        require(userAddressToId[msg.sender] != 0, "User not registered.");
        uint256 get_UserID = userAddressToId[msg.sender];
        require(users[get_UserID].is_Active == true, "User is not active.");

        uint256 _unique_taskid = nextTaskId;

        tasks[_unique_taskid] = taskCreation({
            requester_address: msg.sender,
            requester_name: users[get_UserID].full_name,
            unique_taskid: _unique_taskid,
            task_name: _task_name,
            task_information: _task_information,
            time: _time,
            location: users[get_UserID].location,
            status: TaskStatus.Available,
            number_of_workers_limit: _number_of_workers_limit,
            reward: _reward
        });

        task_ids.push(_unique_taskid);
        nextTaskId++;
        emit Task_Created(msg.sender, _task_name, _unique_taskid);
        
    }

    function getTaskInformation(uint256 _task_id) public view returns (string memory, string memory) {
        return (tasks[_task_id].task_name, tasks[_task_id].task_information);
    }

    function getTaskStatus(uint256 _task_id) public view returns (string memory) {
        TaskStatus status = tasks[_task_id].status;

        if (status == TaskStatus.Available) return "Available";
        if (status == TaskStatus.Reserved) return "Reserved";
        if (status == TaskStatus.Completed) return "Completed";
        if (status == TaskStatus.Cancelled) return "Cancelled";

        return "Unknown";
    }

    function get_task_ids() public view returns(uint256[] memory){
        return task_ids;
    }
    
    //Event that a Task was created
    event Task_Created(address user_address, string task_name, uint256 unique_taskid);

    
}