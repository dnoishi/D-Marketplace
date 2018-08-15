pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Marketplace.sol";

contract TestMarketplace {
    function testSettingAnOwnerDuringCreation() public {
        Marketplace marketplace = new Marketplace();
        Assert.equal(marketplace.owner(), this, "The owner is different than the deployer");
    }
}
