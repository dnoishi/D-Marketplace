var ManageOwner = artifacts.require("./ManageOwner.sol");

contract("ManageOwner", accounts => {

  const owner = accounts[0];
  const admin = accounts[1];
  const storeOwner = accounts[2];


  let added_address;


  it("sets an owner", async () => {
    const manageOwner = await ManageOwner.new();
    assert.equal(await manageOwner.owner.call(), owner);
  });

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

});