//SPDX-License-Identifier: Unlicense
//Setting compiler version, ranging from 0.7.0 to 0.9.0
pragma solidity >=0.7.0 < 0.9.0;

//@dev Despoina Moschokarfi 1516
//@dev Eleni Maria Oikonomou 1529


import "./Reward_Penalty_System.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Task_Selection is Reward_Penalty_System {

    //Creating a struct that has the unique_id as its key value in the mapping
    struct Task_has_Workers{
            uint256 unique_taskid;
            address[] assigned_addresses;
            int[] data_indexed;
    }
    mapping(uint256 => Task_has_Workers) private tw;
    address[] public assigned;
    int[] public data_index;

    //Created to test wether the data regarding the tasks are stored or not
    //For testing purposes
    function get_Task(uint256 u_task) private view returns(taskCreation memory task){
        if (u_task < task_ids.length){
           return tasks[u_task];
        } else{
            revert("The task does not exist...");
        }
    }
    
    function compare_location(string memory location_user, string memory location_task) private pure returns(bool){
        return keccak256(abi.encodePacked(location_user)) == keccak256(abi.encodePacked(location_task));
    }

     //Function for workers to be selected automatically for tasks
    function Select_Worker() public {
        delete assigned;
        delete data_index;

        //for loop for all tasks
        for (uint256 i=0; i < task_ids.length; i++) { 
            uint256 visiting_taskid = task_ids[i]; 
            uint256 assignCounter = 0;

           if ((tasks[visiting_taskid].status == TaskStatus.Available) && (tasks[visiting_taskid].number_of_workers_limit != 0)) {
                for (uint256 j=0; j < u_ids.length; j++) { 
                    uint256 get_UserID = u_ids[j]; 
                    if(users[get_UserID].is_Active == false){
                        continue;
                    }
                    address ID_to_UserAddress = users[get_UserID].user_address;

                    // Check if Worker is already in Task
                    bool result;
                    (result, ) = isWorkerInTask(ID_to_UserAddress, visiting_taskid);

                    if(result) {
                        continue;
                    }

                    //Will be checking the users array with certain parameters. 
                    //Will follow the concept of 'First Come First Served'
                    //In other words, the first who meet the requirements will be the first who
                    //will get the task.
                    if ((users[get_UserID].limit_tasks != 0) && (compare_location(users[get_UserID].location, tasks[visiting_taskid].location)) && (tasks[visiting_taskid].requester_address != ID_to_UserAddress)) {
                        users[get_UserID].limit_tasks -= 1;
                        tasks[visiting_taskid].number_of_workers_limit -= 1;
                        //Temporary storing the address of the workers
                       // assigned.push(ID_to_UserAddress);
                        assignCounter++;
                        //Temporary storing the worker's index to create the appropriate length
                        //data_index.push(0);
                        tw[visiting_taskid].unique_taskid = visiting_taskid;
                        tw[visiting_taskid].assigned_addresses.push(ID_to_UserAddress);
                        tw[visiting_taskid].data_indexed.push(0);

                    }
                    //Once the number reaches zero, call function to change the task's status
                    if (tasks[visiting_taskid].number_of_workers_limit == 0){
                        tasks[visiting_taskid].status = TaskStatus.Reserved;
                        break;
                    } 
                }             
           }
        }
    }


    //Temporary storage for the task ids that share the same requester
    uint256[] private r_ids;
    //uint256[] private w_ids;

    //If Requester, then only show the tasks they uploaded, along with the corresponding status and data, if submitted
    function Table_Task_Requester() public view returns (string[] memory requesterTasks){
        //Make a for loop to bring all tasks that the requester has created
        //The ones that show first, are the tasks with submitted data from the worker's side.
        //Afterwards, are the tasks that have yet to be completed. Shows also the number of workers that have taken the task.
        uint256 count = 0;
        for(uint256 i = 0; i < task_ids.length; i++) {
            uint256 visiting_taskid = task_ids[i];
            if (tasks[visiting_taskid].requester_address == msg.sender) {
                count++;
            }
        }
        requesterTasks = new string[](count);
        uint256 index = 0;
        
        for (uint256 i=0; i < task_ids.length; i++) {
                
            uint256 visiting_taskid = task_ids[i];
            if ((msg.sender == tasks[visiting_taskid].requester_address)){
                string memory taskInfo = string(abi.encodePacked(
                    tasks[visiting_taskid].task_name,
                    " - ",
                    tasks[visiting_taskid].task_information,
                    " - ",
                    getTaskStatus(visiting_taskid)
                    ));
                requesterTasks[index] = taskInfo;
                index++;
            }    
        }
        return requesterTasks;
    }

    //function for every time there is a match in the Table_Task_Worker function, return the assigned task by adding its task name and information
    function Show_Task_Information (uint256 _unique_taskid) public view returns (string memory, string memory){
        return (tasks[_unique_taskid].task_name, tasks[_unique_taskid].task_information);
    }

    
    //Function where worker is shown the tasks which he was assigned.
    function Table_Task_Worker() public view returns (string[] memory){
        uint256 count = 0;
        for (uint256 i = 0; i < task_ids.length; i++) {
            uint256 visiting_taskid = task_ids[i];
            uint256 workerCount = getWorkerCount(visiting_taskid);
            for (uint256 j = 0; j < workerCount; j++) {
                if (tw[visiting_taskid].assigned_addresses[j] == msg.sender) {
                    count++;
                    break;
                }
            }
        }

        string[] memory workerTasks = new string[](count);
        uint256 index = 0;
        string memory strReward;

        for (uint256 i = 0; i < task_ids.length; i++) {
            uint256 visiting_taskid = task_ids[i];
            uint256 workerCount = getWorkerCount(visiting_taskid);
            for (uint256 j = 0; j < workerCount; j++) {
                if (tw[visiting_taskid].assigned_addresses[j] == msg.sender) {
                    strReward = Strings.toString(tasks[visiting_taskid].reward);
                    string memory taskInfo = string(abi.encodePacked(
                    " Name: ",
                    tasks[visiting_taskid].task_name,
                    " - Information: ",
                    tasks[visiting_taskid].task_information,
                    " - Reward: ",
                    strReward
                    ));
                    workerTasks[index] = taskInfo;
                    index++;
                    break;
                }
            }
        }

        return workerTasks;
    }
    
    //Function for when a requester decides to not complete the task.
    function Task_Cancelled_By_Requester(uint256 _unique_taskid) public {
        require(tasks[_unique_taskid].requester_address == msg.sender, "You are not the creator of this task..");
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
    function Task_Cancelled_By_Worker(uint256 _unique_taskid) public {
        bool result;
        uint256 index;
        (result, index) = isWorkerInTask(msg.sender, _unique_taskid);

        require(result == true, "You are not assigned to this task..");
        uint256 get_UserID = userAddressToId[msg.sender];
        users[get_UserID].cancelled_tasks++;
        delete tw[_unique_taskid].assigned_addresses[index];

    }

    //Function to check if a Worker is assigned to a task
    function isWorkerInTask(address user_address, uint256 _unique_taskid) private view returns (bool, uint256){
        for (uint i = 0; i < getWorkerCount(_unique_taskid); i++) {
            if (tw[_unique_taskid].assigned_addresses[i] == user_address) {
                return (true , i);
                }
            }
        return (false, 0);
    }

    //returns how many assigned addresses (workers) a task has currently
    function getWorkerCount(uint _unique_taskid) public view returns(uint) { 
        return tw[_unique_taskid].assigned_addresses.length; 
    }

    function getWorkersInTask(uint _unique_taskid) public view returns(address[] memory){
        return tw[_unique_taskid].assigned_addresses;
    }


    //Creating a struct that has the unique_id as its key value in the mapping
    struct Data_by_Workers{
            uint256 unique_taskid;
            address[] assigned_addresses;
            string[] data;
    }

// let's suppose we have task1 (3 workers)
    // unique_taskid = task1_id
    // assigned_addresses = [addressOfWorker10, addressOfWorker12, addressOfWorker15] = indexes [0, 1, 2]
    // data = [[dataHashByWorker10], [dataHashByWorker12], [dataHashByWorker15]] = indexes [0, 1, 2]

    mapping(uint256 => Data_by_Workers) private worker_data;

    //Event for data submission
    event DataSubmitted(address indexed worker, string dataHash);

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
        
        // bytes32 dataId = keccak256(abi.encodePacked(dataHash, msg.sender, block.timestamp));
        worker_data[_unique_taskid].data[index] = dataHash;

        emit DataSubmitted(msg.sender, dataHash);
    }

    function getDataHashForTask(uint256 _unique_taskid) public view returns (string[] memory){  
        return worker_data[_unique_taskid].data;
    }

}