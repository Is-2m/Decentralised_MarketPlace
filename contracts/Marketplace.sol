// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Item {
        uint id;
        address payable seller;
        string name;
        string description;
        uint price;
        bool isSold;
    }
    
    uint public itemCount;
    mapping(uint => Item) public items;
    
    event ItemListed(uint id, address seller, string name, uint price);
    event ItemSold(uint id, address buyer, uint price);
    event ItemsCleared();  // New event
    
    // New function to clear all items
    function clearItems() public {
        for(uint i = 1; i <= itemCount; i++) {
            delete items[i];
        }
        itemCount = 0;
        emit ItemsCleared();
    }
    
    // Function to list an item
    function listItem(string memory _name, string memory _description, uint _price) public {
        require(_price > 0, "Price must be greater than 0");
        itemCount++;
        items[itemCount] = Item(itemCount, payable(msg.sender), _name, _description, _price, false);
        emit ItemListed(itemCount, msg.sender, _name, _price);
    }
    
    // Function to buy an item
    function buyItem(uint _id) public payable {
        Item storage item = items[_id];
        require(_id > 0 && _id <= itemCount, "Item does not exist");
        require(!item.isSold, "Item already sold");
        require(msg.value == item.price, "Incorrect ETH sent");
        item.seller.transfer(msg.value);
        item.isSold = true;
        emit ItemSold(_id, msg.sender, item.price);
    }
}