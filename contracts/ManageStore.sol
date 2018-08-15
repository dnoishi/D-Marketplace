pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ManageOwner.sol";


contract ManageStore is ManageOwner {

    // State variables of the contract
    event LogStoreAdded(address _owner, uint _storeId);
    event LogProductAdded(uint _storeId, uint _productId);
    event LogProductRemoved(uint _storeId, uint _productId);
    event LogPriceChanged(uint _storeId, uint _productId, uint _newPrice);
    event LogQuantityChanged(uint _storeId, uint _productId, uint _newQuantity);
    event LogStoreWithdrawed(address _reciver, uint _balance);
    
    
    struct Store {
        bytes metadataHash; //IPFS Hash
        uint balance;
        uint productCount;
    }

    Store[] public stores;

    mapping (uint => address) public storeToOwner;
    mapping (address => uint) ownerStoreCount;

    struct Product {
        bytes metadataHash; //IPFS Hash
        uint price;
        uint quantity;
    }
    
    Product[] public products;
    mapping(uint => uint) public productToStore; //product of store 

    /*
    * Modifiers
    */

    /**
    * @dev Throws if called by any account other than the admins.
    */
    modifier onlyStoreOwner {
        require(isStoreOwner[msg.sender] == true, "Only store owner can call this function.");
        _;
    }

    // Check caller is the owner of the store
    modifier onlyOwnerOf(uint _storeId) {
        require(msg.sender == storeToOwner[_storeId], "Only the owner of this store can call this function");
        _;
    }

    // Check product is from the store
    modifier storeOf(uint _storeId, uint _productId) {
        require(_storeId == productToStore[_productId], "Only can remove product of the store");
        _;
    }

    //Initialize safeMath library
    using SafeMath for uint; 

    /**
    * @dev Allows a store owner to add a store front to the market.
    * @param _metadata IPFS Hash with the store metadata.
    */
    function addStore(bytes _metadata) public onlyStoreOwner {
        uint id = stores.push(Store({metadataHash: _metadata, balance: 0, productCount: 0})).sub(1);
        storeToOwner[id] = msg.sender;
        ownerStoreCount[msg.sender].add(1);
        emit LogStoreAdded(msg.sender, id);
    }

    /**
    * @dev Allows a store owner to add a product to an existing store.
    * @param _storeId Id of the store where the product will be added.
    * @param _productMetadata IPFS Hash with the product metadata.
    * @param _price price of the product on the market.
    * @param _quantity quantity avaliable for users to purchase.
    */
    function addProductToStore(uint _storeId, bytes _productMetadata, uint _price, uint _quantity) public onlyOwnerOf(_storeId){
        uint id = products.push(Product({metadataHash: _productMetadata, price: _price, quantity: _quantity})).sub(1);
        productToStore[id] = _storeId;
        emit LogProductAdded(_storeId, id);
    }

    function removeProductFromStore(uint _storeId, uint _productId) public onlyOwnerOf(_storeId) storeOf(_storeId, _productId){
        delete products[_productId];
        emit LogProductRemoved(_storeId, _productId);
    }

    function changeProductPrice(uint _storeId, uint _productId, uint _newPrice) public onlyOwnerOf(_storeId) storeOf(_storeId, _productId){
        Product storage p = products[_productId];
        p.price = _newPrice;
        emit LogPriceChanged(_storeId, _productId, _newPrice);
    }

    function changeProductQuantity(uint _storeId, uint _productId, uint _newQuantity) public onlyOwnerOf(_storeId) storeOf(_storeId, _productId){
        Product storage p = products[_productId];
        p.quantity = _newQuantity;
        emit LogQuantityChanged(_storeId, _productId, _newQuantity);
    }

    function withdrawStoreFunds(uint _storeId) public onlyOwnerOf(_storeId) {
        Store storage s = stores[_storeId]; //Get reference of the store
        uint contractBalance = address(this).balance; //Get contract current balance
        uint amountToSend = s.balance; //get the store balance
        require(contractBalance >= amountToSend, "Contract doesn't count with the balance need it"); 
        require(amountToSend > 0, "Your store balance needs to be greater than 0"); //check that the store has a valid balace to withdraw
        s.balance -= amountToSend; //remove amount from store reference
        address(this).balance.sub(amountToSend); //remove balance from contract
        address(msg.sender).balance.add(amountToSend); //send it to function caller
        emit LogStoreWithdrawed(msg.sender, amountToSend);
    }
    
}