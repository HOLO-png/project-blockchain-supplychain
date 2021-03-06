pragma solidity ^0.6.0;

import "./Ownable.sol";
import "./Item.sol";

contract ItemManager is Ownable{
    enum SupplyChainState{Created, Paided, Delivered}

    struct S_Item {
        Item _item;
        string _identifier;
        string _image;
        uint _itemPrice;
        address _itemAddress;
        ItemManager.SupplyChainState _state;
    }
    mapping (uint => S_Item ) public items;

    uint public itemIndex = 0;

    function getItemIndex() public view returns(uint){
        return itemIndex;
    }

    event SupplyChainStep(uint _itemIndex, string _identifier, string _image, int _itemPrice, uint _step, address _itemAddress);
    
    function createItem(string memory _identifier, string memory _image, uint _itemPrice, address _ownerCreate) public onlyOwner{
        Item item = new Item(this, _itemPrice, itemIndex, _ownerCreate);
        items[itemIndex]._item = item;
        items[itemIndex]._identifier = _identifier;
        items[itemIndex]._image = _image;
        items[itemIndex]._itemPrice = _itemPrice;
        items[itemIndex]._itemAddress = address(item);
        items[itemIndex]._state = SupplyChainState.Created;

        emit SupplyChainStep(itemIndex, string(items[itemIndex]._identifier), string(items[itemIndex]._image), int(items[itemIndex]._itemPrice), uint(items[itemIndex]._state), address(item));
        itemIndex ++;

    }

    function triggerPayment(uint _itemIndex) public payable{
        require(items[_itemIndex]._itemPrice == msg.value, "Only full payments accepted!");
        require(items[_itemIndex]._state == SupplyChainState.Created, "Item is further in the chain!");

        items[_itemIndex]._state = SupplyChainState.Paided;
         emit SupplyChainStep(itemIndex, string(items[itemIndex]._identifier), string(items[itemIndex]._image), int(items[itemIndex]._itemPrice), uint(items[itemIndex]._state), address(items[_itemIndex]._item));
    
    }

    function triggerDelivery(uint _itemIndex)public onlyOwner{        
        require(items[_itemIndex]._state == SupplyChainState.Paided, "Item is further in the chain!");
        items[_itemIndex]._state = SupplyChainState.Delivered;
        emit SupplyChainStep(itemIndex, string(items[itemIndex]._identifier), string(items[itemIndex]._image), int(items[itemIndex]._itemPrice), uint(items[itemIndex]._state), address(items[_itemIndex]._item));
    }

    function removeItem(uint _itemIndex) public onlyOwner {
        require(items[_itemIndex]._state == SupplyChainState.Delivered, "Item not eligible to delete!");
        delete items[_itemIndex];
        emit SupplyChainStep(itemIndex, string(items[itemIndex]._identifier), string(items[itemIndex]._image), int(items[itemIndex]._itemPrice), uint(items[itemIndex]._state), address(items[_itemIndex]._item));
    }
    
     function updateItem(uint _itemIndex, string memory _identifier, string memory _image, uint _itemPrice ) public onlyOwner {
        require(items[_itemIndex]._state == SupplyChainState.Created, "Item not eligible to update!");
        items[_itemIndex]._identifier = _identifier;
        items[_itemIndex]._image = _image;
        items[_itemIndex]._itemPrice = _itemPrice;
        items[_itemIndex]._state = SupplyChainState.Created;
        emit SupplyChainStep(_itemIndex, string(items[itemIndex]._identifier), string(items[itemIndex]._image), int(items[itemIndex]._itemPrice), uint(items[itemIndex]._state), address(items[_itemIndex]._item));
    }
}