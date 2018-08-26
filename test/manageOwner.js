var ManageOwner = artifacts.require("./ManageOwner.sol");
const { assertRevert } = require('./helpers/assertRevert');

contract("ManageOwner", accounts => {

  const owner = accounts[0];
  const admin = accounts[1];
  const storeOwner = accounts[2];
  const other = accounts[3];
  let added_address;

  /// @notice Checks if in the contract creation the sender is added as contract owner.
  it("sets an owner", async () => {
    const manageOwner = await ManageOwner.new();
    assert.equal(await manageOwner.owner.call(), owner);
  });

  /// @notice Validates that only the owner of the contract can add administrators.
  it("only owner can add admin", async () => {
    const manageOwner = await ManageOwner.deployed();
    await assertRevert(manageOwner.registerAdmin(admin, { from: storeOwner }));
  });

  /// @notice Checks that a new admin is added correctly to the contract.
  it("contract owner can add an admin", async () => {
    const manageOwner = await ManageOwner.deployed();

    let eventEmitted = false;

    let event = manageOwner.LogAddressAdded();
    await event.watch((err, res) => {
      added_address = res.args._address;
      eventEmitted = true;
    });

    await manageOwner.registerAdmin(admin, { from: owner });

    assert.equal(
      added_address,
      admin,
      "the address of the last added admin does not match the expected value"
    );
    assert.equal(
      eventEmitted,
      true,
      "adding an admin should emit a Log Address Added event"
    );
  });

  /// @notice Validates that only contract administrators can add a store owner.
  it("only admins can add store owner", async () => {
    const manageOwner = await ManageOwner.deployed();
    await assertRevert(manageOwner.registerOwner(admin, { from: other }));
  });

  /// @notice Checks that a new store owner is added correctly to the contract.
  it("admin can add a store owner", async () => {
    const manageOwner = await ManageOwner.deployed();

    let eventEmitted = false;

    let event = manageOwner.LogAddressAdded();
    await event.watch((err, res) => {
      added_address = res.args._address;
      eventEmitted = true;
    });

    await manageOwner.registerOwner(storeOwner, { from: admin });

    assert.equal(
      added_address,
      storeOwner,
      "the address of the last added store owner does not match the expected value"
    );
    assert.equal(
      eventEmitted,
      true,
      "adding a store owner should emit a Log Address Added event"
    );
  });

  /// @notice Validates that an existing store owner cannot be added again.
  it("can't add existing store owner", async () => {
    const manageOwner = await ManageOwner.deployed();
    await assertRevert(manageOwner.registerOwner(storeOwner, { from: owner }));
  });

});