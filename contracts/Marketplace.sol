pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Marketplace is Ownable, Pausable {

    // State variables of the contract
    event LogAddressAdded(address _address, string _type);


    // Admin addresses array
    address[] public AdminAddresses;
    uint public NoAdmins; 
    mapping (address => bool) isAdmin;

    address[] public OwnerAddresses;
    uint public NoOwners;
    mapping (address => bool) isOwner;

    struct Store {
        bytes metadataHash; //IPFS Hash
        uint balance;
        uint productCount;
    }


    Store[] public stores;

    mapping (uint => address) public storeToOwner;
    mapping (address => uint) ownerStoreCount;


    // Modifiers

    /**
    * @dev Throws if called by any account other than the admins.
    */
    modifier onlyAdmin {
        require(isAdmin[msg.sender] == true, "Only admin can call this function.");
        _;
    } 

    // Event that will be fired on changes

    //Initialize safeMath library
    using SafeMath for uint; 

    // Initialize Ownable contract
    constructor() public {
        Ownable(msg.sender);
    }

    /**
    * @dev Allows the contract owner to add a new Admin to the contract.
    * @param _address The address to add as Admin.
    */
    function registerAdmin(address _address) public onlyOwner whenNotPaused {
        AdminAddresses.push(_address);
        NoAdmins = AdminAddresses.length;
        isAdmin[_address] = true;
        emit LogAddressAdded(_address, "Admin");
    }

    /**
    * @dev Allows an Admin to add a new Store Owner to the contract.
    * @param _address The address to add as Owner.
    */
    function registerOwner(address _address) public onlyAdmin whenNotPaused {
        OwnerAddresses.push(_address);
        NoOwners = OwnerAddresses.length;
        isOwner[_address] = true;
        emit LogAddressAdded(_address, "Owner");
    }

}