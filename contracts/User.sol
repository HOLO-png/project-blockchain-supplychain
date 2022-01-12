pragma solidity ^0.6.0;

contract User {
    Users[] public arrUser;
    uint public itemIndex = 0;

    struct Users{
        string _id;
        address _wallet;
    }

    event UserInfo(address _wallet, string _id);

    function Login(string memory _id) public {
        Users memory newUser = Users(_id, msg.sender);
        arrUser.push(newUser);
        emit UserInfo(msg.sender, _id);
        itemIndex ++;
    }
}