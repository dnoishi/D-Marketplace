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
        uint[] productsIds;
    }

    Store[] public stores;

    mapping (uint => address) public storeToOwner;
    mapping (address => uint) public ownerStoreCount;

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
        uint id = stores.push(Store({metadataHash: _metadata, balance: 0, productsIds: new uint[](0) })).sub(1);
        storeToOwner[id] = msg.sender;
        ownerStoreCount[msg.sender]++;
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
        Store storage s = stores[_storeId];
        uint index = s.productsIds.length++;
        s.productsIds[index] = id;
        productToStore[id] = _storeId;
        emit LogProductAdded(_storeId, id);
    }

    /**
    * @dev Allows a store owner to remove a product from the store.
    * @param _storeId Id of the store where the product will be removed.
    * @param _productId id of the product to be removed.
    */
    function removeProductFromStore(uint _storeId, uint _productId) public onlyOwnerOf(_storeId) storeOf(_storeId, _productId){
        //Remove product
        delete products[_productId];
        Product storage replacer = products[products.length - 1];
        products[_productId] = replacer;
        products.length--;
        
        //Remove id of product from store
        Store storage s = stores[_storeId];
        for(uint index = 0; index < s.productsIds.length; index++){
            if(s.productsIds[index] == _productId){
                delete s.productsIds[index];
                s.productsIds[index] = _productId;
                s.productsIds.length--;
                break;
            }
        }
        
        emit LogProductRemoved(_storeId, _productId);
    }

    /**
    * @dev Allows a store owner to change a product price from the store.
    * @param _storeId Id of the store.
    * @param _productId id of the product to be changed.
    * @param _newPrice new price for the product.
    */
    function changeProductPrice(uint _storeId, uint _productId, uint _newPrice) public onlyOwnerOf(_storeId) storeOf(_storeId, _productId){
        Product storage p = products[_productId];
        p.price = _newPrice;
        emit LogPriceChanged(_storeId, _productId, _newPrice);
    }

    /**
    * @dev Allows a store owner to change a avaliable quantity of a product.
    * @param _storeId Id of the store.
    * @param _productId id of the product to be changed.
    * @param _newQuantity new quantity for the product.
    */
    function changeProductQuantity(uint _storeId, uint _productId, uint _newQuantity) public onlyOwnerOf(_storeId) storeOf(_storeId, _productId){
        Product storage p = products[_productId];
        p.quantity = _newQuantity;
        emit LogQuantityChanged(_storeId, _productId, _newQuantity);
    }

    /**
    * @dev Allows a store owner to withdraw the balance of a store.
    * @param _storeId Id of the store.
    */
    function withdrawStoreFunds(uint _storeId) public onlyOwnerOf(_storeId) {
        Store storage s = stores[_storeId]; //Get reference of the store
        uint contractBalance = address(this).balance; //Get contract current balance
        uint amountToSend = s.balance; //get the store balance
        require(contractBalance >= amountToSend, "Contract doesn't count with the balance need it"); 
        require(amountToSend > 0, "Your store balance needs to be greater than 0"); //check that the store has a valid balace to withdraw
        s.balance -= amountToSend; //remove amount from store reference
        address(msg.sender).transfer(amountToSend); //send it to function caller
        emit LogStoreWithdrawed(msg.sender, amountToSend);
    }

    /**
    * @dev Allows to retrive the number of stores registered.
    */
    function getStoreCount() public view returns (uint){
        return stores.length;
    }
    
    function getStoreProducts(uint _storeId) public view returns (uint[]){
        return stores[_storeId].productsIds;
    }
    
    function getStoreProductsCount(uint _storeId) public view returns (uint){
        return stores[_storeId].productsIds.length;
    }
    
}