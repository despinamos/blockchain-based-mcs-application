// SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.0 <0.9.0;

contract UserInformation {

    struct User_Registration {
        uint256 u_id;
        string full_name;
        address user_address;
        string location;
        uint cancelled_tasks;
        uint completed_tasks;
        uint limit_tasks;
        uint reputation;
        bool is_Active;
    }

    uint256 public nextUserId = 1;

    mapping(uint256 => User_Registration) public users;
    uint256[] public u_ids;
    mapping(address => uint256) public userAddressToId;

    event User_Created(address user_address, string full_name, string location);

    function setUser_Information(string memory _full_name, string memory _location) public {        
        // Check if the user is already registered
        require(userAddressToId[msg.sender] == 0, "User already registered.");

        uint256 user_ID = nextUserId;

        // Set user's information
        users[user_ID] = User_Registration({
            u_id: user_ID,
            user_address: msg.sender,
            full_name: _full_name,
            location: _location,
            cancelled_tasks: 0,
            completed_tasks: 0,
            limit_tasks: 3,  // Default task limit for reputation 50
            reputation: 50,  // Default reputation
            is_Active: true
        });

        userAddressToId[msg.sender] = user_ID;  // Map address to user ID
        u_ids.push(user_ID);
        nextUserId++;

        emit User_Created(msg.sender, _full_name, _location);  // Emit event
    }

    function getUserInformation(uint256 _u_id) public view returns (User_Registration memory) {
        require(_u_id != 0 && _u_id < nextUserId, "Invalid user ID");
        return users[_u_id];
    }


    function Arrange_Limit(uint256 user_ID) internal returns (uint) {
        if (users[user_ID].reputation < 30) {
           users[user_ID].is_Active = false; // De-activate user if reputation is too low
        } else if (users[user_ID].reputation >= 30 && users[user_ID].reputation < 50) {
            users[user_ID].limit_tasks = 1;
        } else if (users[user_ID].reputation >= 50 && users[user_ID].reputation < 70) {
            users[user_ID].limit_tasks = 3;
        } else if (users[user_ID].reputation >= 70 && users[user_ID].reputation < 90) {
            users[user_ID].limit_tasks = 5;
        } else if (users[user_ID].reputation >= 100) {
            users[user_ID].reputation = 100;  // Cap reputation at 100
        }
        return users[user_ID].limit_tasks;
    }

    function Get_u_ids() public view returns (uint256[] memory){
        return u_ids;
    }
}