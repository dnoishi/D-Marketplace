var ManageOwner = artifacts.require("./ManageOwner.sol");
var ManageStore = artifacts.require("./ManageStore.sol");
var Marketplace = artifacts.require("./Marketplace.sol");


module.exports = function(deployer) {
  deployer.deploy(ManageOwner);
  deployer.deploy(ManageStore);
  deployer.deploy(Marketplace);
};
