pragma solidity ^0.6.0;
contract cartManager {
    enum SupplyChainState{Paided, Delivered}

    struct S_Order {
        string _userId;
        uint _orderPrice;
        address _userAddress;
        cartManager.SupplyChainState _state;
    }

    event OrderChainStep(string _userId, uint _orderPrice, uint _step, address _userAddress);

    mapping (address => S_Order ) public order;

    function createOrder(string memory _userId, uint _orderPrice, address _userAddress) public payable{
        order[_userAddress]._userId = _userId;
        order[_userAddress]._orderPrice = _orderPrice;
        order[_userAddress]._userAddress = _userAddress;

        require(order[_userAddress]._orderPrice == msg.value, "Only full payments accepted!");
        order[_userAddress]._state = SupplyChainState.Paided;

        emit OrderChainStep(string(order[_userAddress]._userId), uint(order[_userAddress]._orderPrice), uint(order[_userAddress]._state), address(order[_userAddress]._userAddress));
    }

    function triggerDelivery(address _userAddress) public {
        require(order[_userAddress]._state == SupplyChainState.Paided, "Item is further in the chain!");
        order[_userAddress]._state = SupplyChainState.Delivered;

        emit OrderChainStep(string(order[_userAddress]._userId), uint(order[_userAddress]._orderPrice), uint(order[_userAddress]._state), address(order[_userAddress]._userAddress));
    }

    function removeItem(address _userAddress) public {
        require(order[_userAddress]._state == SupplyChainState.Delivered, "Item not eligible to delete!");
        delete order[_userAddress];
        emit OrderChainStep(string(order[_userAddress]._userId), uint(order[_userAddress]._orderPrice), uint(order[_userAddress]._state), address(order[_userAddress]._userAddress));    }
}