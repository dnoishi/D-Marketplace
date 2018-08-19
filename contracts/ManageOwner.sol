pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract ManageOwner is Ownable, Pausable {

    // State variables of the contract
    event LogAddressAdded(address _address, string _type);
    event LogAddressRemoved(address _address, string _type);

    // Admin addresses array
    address[] public AdminAddresses;
    mapping (address => uint) public adminIndex;
    mapping (address => bool) public isAdmin;

    address[] public OwnerAddresses;
    mapping (address => uint) public OwnerIndex;
    mapping (address => bool) public isStoreOwner;


    /**
    * @dev Throws if called by any account other than the admins.
    */
    modifier onlyAdmin {
        require(isAdmin[msg.sender] == true, "Only admin can call this function.");
        _;
    }

    /**
    * @dev Throws if called by any account other than the admins.
    */
    modifier validAddress(address _address) {
        require(_address != address(0), "Need to send valid address.");
        _;
    } 

    // Initialize Ownable contract
    constructor() public {
        Ownable(msg.sender);
        registerAdmin(msg.sender);
    }

    /**
    * @dev Allows the contract owner to add a new Admin to the contract.
    * @param _address The address to add as Admin.
    */
    function registerAdmin(address _address) public onlyOwner whenNotPaused validAddress(_address){
        require(isAdmin[_address] != true, "address already admin");
        uint id = AdminAddresses.push(_address) - 1;
        adminIndex[_address] = id;
        isAdmin[_address] = true;
        emit LogAddressAdded(_address, "Admin");
    }

    /**
    * @dev Allows the contract owner to add a new Admin to the contract.
    * @param _address The address to remove as Admin.
    */
    function removeAdmin(address _address) public onlyOwner whenNotPaused validAddress(_address){
        require(isAdmin[_address] == true, "address is not admin");
        isAdmin[_address] = false;
        uint id = adminIndex[_address];
        //Delete Admin
        delete AdminAddresses[id];
        address replacer = AdminAddresses[AdminAddresses.length - 1];
        AdminAddresses[id] = replacer;
        AdminAddresses.length--;
        
        emit LogAddressRemoved(_address, "Admin");
    }

    /**
    * @dev Allows an Admin to add a new Store Owner to the contract.
    * @param _address The address to add as Owner.
    */
    function registerOwner(address _address) public onlyAdmin whenNotPaused validAddress(_address){
        require(isStoreOwner[_address] != true, "address already store owner");
        uint id = OwnerAddresses.push(_address) - 1;
        OwnerIndex[_address] = id;
        isStoreOwner[_address] = true;
        emit LogAddressAdded(_address, "Owner");
    }

    /**
    * @dev Allows an Admin to add a new Store Owner to the contract.
    * @param _address The address to remove as Owner.
    */
    function removeOwner(address _address) public onlyAdmin whenNotPaused validAddress(_address){
        require(isStoreOwner[_address] == true, "address is not store owner");
        isStoreOwner[_address] = false;
        uint id = OwnerIndex[_address];
        //Delete owner
        delete OwnerAddresses[id];
        address replacer = OwnerAddresses[OwnerAddresses.length - 1];
        OwnerAddresses[id] = replacer;
        OwnerAddresses.length--;

        emit LogAddressRemoved(_address, "Owner");
    }

    /**
    * @dev Allows to retrive the amount of admin addresses registered.
    */
    function getAdminCount() public view onlyOwner returns (uint){
        return AdminAddresses.length;
    }

    /**
    * @dev Allows to retrive the amount of store owners addresses registered.
    */
    function getStoreOwnersCount() public view onlyAdmin returns (uint){
        return OwnerAddresses.length;
    }

}