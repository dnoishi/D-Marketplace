pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./ManageStore.sol";

contract Marketplace is ManageStore {
    
    
    //Initialize safeMath library
    using SafeMath for uint; 

    event LogProductSold(uint productId, uint price, address buyer);

    /**
    * @dev Allows an user to buy a product
    * @param _productId Index of products[].
    */
    function buyProduct(uint _productId) public payable{
        Product storage p = products[_productId];
        require(p.quantity > 0, "Product unavaliable");
        require(msg.value >= p.price, "need to pay according");

        //Check if user pay more than need it
        uint refund = msg.value - p.price;
        if(msg.value > 0)
            msg.sender.transfer(refund);

        //Remove the quantity from product
        p.quantity -= 1;

        //Add the balance to the store
        uint storeId = productToStore[_productId];
        Store storage s = stores[storeId];
        s.balance += p.price;
        emit LogProductSold(_productId, p.price, msg.sender);
    }
    
    /**
    * @dev Allow us to get the number of avaliable stores on the marketplace.
    */
    function getAvaliableStoresNo() public view returns (uint){
        return stores.length;
    }
    
    function getContractBalance() public view returns (uint){
        return address(this).balance;
    }
}