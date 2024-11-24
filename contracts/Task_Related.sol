//SPDX-License-Identifier: Unlicense


//@dev Despoina Moschokarfi 1516
//@dev Eleni Maria Oikonomou 1529


//Note: This is the second and third contract. They both inherit the root contract in the User_Related.sol


//Setting compiler version, ranging from 0.7.0 to 0.9.0
pragma solidity >=0.7.0 <0.9.0;
//Importing the appropriate parent contracts from the corresponding files in order: UserInformation
import "./User_Related.sol";


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
        address user_address;
        string requester_name;
        string task_name;
        uint256 unique_taskid;
        string task_information;
        uint time;
        //uint256 taskLatitude;
        //uint256 taskLongitude;
        TaskStatus status;
        int number_of_workers_limit;
        uint reward;
        //int[] task_data;
    }


    mapping(uint256 => taskCreation)public tasks;

    uint256[] public task_ids;
    //Setting a task's unique ID depending on the length of the array
    function Set_Task_Unique_ID() public view returns(uint256){
        return task_ids.length;
    }


    //Creating a fucntion that sets and stores Task Information.
    function setTask_Information(string  memory _task_name, string memory _task_information, int _number_of_workers_limit, uint _reward /*, int[] memory _data*/) public {
        //Adding new task's nformation with _unique_taskid playing the role of index.
        uint256 _unique_taskid = Set_Task_Unique_ID();
        uint256 get_UserID = userAddressToId[msg.sender];

        tasks[_unique_taskid] = taskCreation({
            user_address: msg.sender,
            requester_name: users[get_UserID].full_name,
            unique_taskid: _unique_taskid,
            task_name: _task_name,
            task_information: _task_information,
            time: 7 days,
            status: set_status(),
            number_of_workers_limit: _number_of_workers_limit,
            reward: _reward
          //  task_data: _data
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
    function set_status() public pure returns (TaskStatus) {
        return TaskStatus.Available;
    }
    
}

contract Task_Selection_Process is UserInformation, Task_Initialization{

    //Creating a struct that has the unique_id as its key value in the mapping
    struct Task_has_Workers{
            uint256 unique_taskid;
            address[] assigned_addresses;
            int[] data_indexed;


    }
    mapping(uint256 => Task_has_Workers) public tw;
    address[] assigned;
    int[] data_index;

    //Created to test wether the data regarding the tasks are stored or not
    //For testing purposes
    function get_Task(uint256 u_task) public view returns(taskCreation memory task){
        if (u_task < task_ids.length){
           return tasks[u_task];
        } else{
            revert("The task does not exist...");
        }
    }
    

    //Function for workers to be selected automatically for tasks
    function Select_Worker() public {
        //for loop for all tasks
        for (uint256 i=0; i < task_ids.length; i++) {
            uint256 visiting_taskid = task_ids[i];

           if ((tasks[visiting_taskid].status == TaskStatus.Available) && (tasks[visiting_taskid].number_of_workers_limit != 0)) {
              for (uint256 j=0; j < u_ids.length; j++) { 
                uint256 get_UserID = u_ids[j];
                address ID_to_UserAddress = users[get_UserID].user_address;

                //Will be checking the users array with certain parameters. 
                //Will follow the concept of 'First Come First Served'
                //In other words, the first who meet the requirements will be the first who
                //will get the task.
                if ((users[get_UserID].limit_tasks != 0)){
                    users[get_UserID].limit_tasks -= 1;
                    tasks[visiting_taskid].number_of_workers_limit -= 1;
                    //Temporary storing the address of the workers
                    assigned.push(ID_to_UserAddress);
                    //Temporary storing the worker's index to create the appropriate length
                    data_index.push(0);



                }
                //Once the number reaches zero, call function to change the task's status
                if (tasks[visiting_taskid].number_of_workers_limit == 0){
                    TaskStatus_Update(visiting_taskid, TaskStatus.Reserved);
                    tw[visiting_taskid] = Task_has_Workers({
                        unique_taskid: visiting_taskid,
                        assigned_addresses: assigned,
                        data_indexed:data_index
                    }); 

                    delete assigned;
                    delete data_index;
                    }    
                }             

           }
        }
    }

    //Temporary storage for the task ids that share the same requester
    uint256[] r_ids;

    //If Requester, then only show the tasks they uploaded, along with the corrensponding status and data, if submitted
    function Table_Task_Requester() public {
        //Make a for loop to bring all tasks that the requester has created
        //The ones that show first, are the tasks with submitted data from the worker's side.
        //Afterwards, are the tasks that have yet to be completed. Shows also the number of workers that have taken the task.
        for (uint256 i=0; i < task_ids.length; i++) {
                uint256 visiting_taskid = task_ids[i];
                //Temporarily, storing the task ids with the condition that they were created by the same requester
                if ((msg.sender == tasks[visiting_taskid].user_address)){
                    r_ids.push(visiting_taskid);
                    Show_Task_Information(visiting_taskid);
                }
                
            }
            delete r_ids;
        }

    //function for everytime there is a match in the Table_Task_Worker function, return the assigned task by adding its task name and information
    function Show_Task_Information (uint256 _unique_taskid) private view returns (string memory, string memory){
        return (tasks[_unique_taskid].task_name,tasks[_unique_taskid].task_information);
    }
    
    


    
    //Function where worker is shown the tasks in which he was assigned.
    function Table_Task_Worker() public view{
        //Take the structs has_Workers length and store the corresponding unique_taskid
        //in an internal variable
        for (uint256 i=0; i< task_ids.length; i++){
            uint256 visiting_taskid = tw[i].unique_taskid;
            //Loop to check each address from the address array of the unique_taskid
            //If there is a match, then push unique_taskid and call function to 
            //return the corresponding results.
            for (uint256 j=0; j < getWorkerCount(visiting_taskid); j++){
                if(tw[visiting_taskid].assigned_addresses[j] == msg.sender){
                    Show_Task_Information(visiting_taskid);
                }
            }
        }
    }


    
    //Function for when a worker decides to not complete the task.
    function Task_Cancelled(uint256 _unique_taskid) public {
        require(tasks[_unique_taskid].user_address == msg.sender, "You are not the creator of this task..");
        //uint256 get_UserID = userAddressToId[msg.sender];
        if((getWorkerCount(_unique_taskid) == 0) || (tasks[_unique_taskid].status == TaskStatus.Completed)) {
                delete tasks[_unique_taskid];
                delete task_ids[_unique_taskid];
        }else{
            for (uint256 i=0; i< getWorkerCount(_unique_taskid); i++){
                if(tw[_unique_taskid].assigned_addresses[i] == msg.sender){
                    //
                    delete tw[_unique_taskid].assigned_addresses[i];
                }
            }
        }
    }

    //Function for when a worker wants to cancel a task
    function Task_Cancelled_Worker(uint256 _unique_taskid) public {
        bool result;
        uint256 index;
        (result, index) = isWorkerInTask(msg.sender, _unique_taskid);

        require(result == true, "You are not assigned to this task..");
        uint256 get_UserID = userAddressToId[msg.sender];
        users[get_UserID].cancelled_tasks++;
        delete tw[_unique_taskid].assigned_addresses[index];

    }

    //Function to check if a Worker is assigned to a task
    function isWorkerInTask(address user_address, uint256 _unique_taskid) public view returns (bool, uint256){
        for (uint i = 0; i < getWorkerCount(_unique_taskid); i++) {
            if (tw[_unique_taskid].assigned_addresses[i] == user_address) {
                return (true , i);
                }
            }
        return (false, 0);
    }

    //returns how many assigned addresses (workers) a task has currently
    function getWorkerCount(uint _unique_taskid) private view returns(uint) { 
        return tw[_unique_taskid].assigned_addresses.length; 
    }

    //We tested the quality of the data and depending of how well the data is, we give a better reward
    function Testing_Quality_Data() public {
            //pass
    }

     //Updating the task's status, either automatically either by the user's request
     function TaskStatus_Update (uint256 _unique_taskid, TaskStatus _status_new)  public {
        uint256 current_taskid = tasks[_unique_taskid].unique_taskid;
        
        //Converting the enum into an uint, depending on the corresponding number: 0,1,2,3. Check comment for enum TaskStatus above
        uint256 taskstatus_old = uint256(TaskStatus(tasks[_unique_taskid].status));
        uint256 taskstatus_new = uint256(TaskStatus(_status_new));

        if (taskstatus_old != taskstatus_new){
            tasks[current_taskid].status = _status_new;
        }


    }

    //Creating a struct that has the unique_id as its key value in the mapping
    struct Data_by_Workers{
            uint256 unique_taskid;
            address[] assigned_addresses;
            bytes32[] data;
    }
    mapping(uint256 => Data_by_Workers) public worker_data;

    //Event for data submission
    event DataSubmitted(address indexed worker, bytes32 dataId, uint timestamp);

    //Function for a Worker to submit data for a task he is assigned to
    //Using data_indexed to check if the corresponding slot matches the worker's index and overwrite it, if yes
    //If no, revert()
    //Then create a dataId hash that includes the data hash in the off-chain database,
    //the worker address and the block timestamp and add it in the respective array spot
    function Submitting_Data (uint256 _unique_taskid, string memory dataHash) public{
        bool result;
        uint256 index;
        (result, index) = isWorkerInTask(msg.sender, _unique_taskid);

        require(result == true, "You are not assigned to this task..");
        
        bytes32 dataId = keccak256(abi.encodePacked(dataHash, msg.sender, block.timestamp));
        worker_data[_unique_taskid].data[index] = dataId;

        emit DataSubmitted(msg.sender, dataId, block.timestamp);
    }

    // function getDataHashForTask(uint256 _unique_taskid, uint256 _worker_id) public view returns (string memory){
    //     bool result;
    //     uint256 index;
    //     (result, index) = isWorkerInTask(users[_worker_id].user_address, _unique_taskid);

    //     require(result == true, "This worker is not assigned to this task..");

    //     //return worker_data[_unique_taskid].data[];
    // }
}