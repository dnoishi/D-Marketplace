var ManageStore = artifacts.require("./ManageStore.sol");
const { assertRevert } = require('./helpers/assertRevert');

contract("ManageStore", accounts => {
  const owner = accounts[0];
  const storeOwner = accounts[1];
  const other = accounts[2];
  const ipfsHash = 0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231;

  let product_id;
  let store_id;
  let added_address = '';

  const price = web3.toWei(1, "ether");
  const quantity = 10;

  it("only storeOwner can add store front", async () => {
    const manageStore = await ManageStore.deployed();
    await assertRevert(manageStore.addStore(ipfsHash, { from: other }));
  });

  it("store owner can add a store front", async () => {
    const manageStore = await ManageStore.deployed();

    await manageStore.registerOwner(storeOwner, { from: owner });

    let eventEmitted = false;
    let expectedId = 0;

    let event = manageStore.LogStoreAdded();
    await event.watch((err, res) => {
      added_address = res.args._owner;
      store_id = res.args._storeId;
      eventEmitted = true;
    });

    await manageStore.addStore(ipfsHash, { from: storeOwner });

    assert.equal(
      added_address,
      storeOwner,
      "the owner of the last added store does not match the expected value"
    );
    assert.equal(
      store_id,
      expectedId,
      "the storeId of the last added store does not match the expected value"
    );
    assert.equal(
      eventEmitted,
      true,
      "adding a store should emit a Log Store Added event"
    );
  });

  it("only storeOwner can add product to store", async () => {
    const manageStore = await ManageStore.deployed();
    await assertRevert(manageStore.addProductToStore(store_id, ipfsHash, price, quantity, {
        from: other
      }));
  });

  it("only can add product to its store front", async () => {
    const manageStore = await ManageStore.deployed();
    let other_store_id = 1;
    await assertRevert(manageStore.addProductToStore(other_store_id, ipfsHash, price, quantity, {
        from: storeOwner
      }));
  });

  it("store owner can add a product to the store", async () => {
    const manageStore = await ManageStore.deployed();

    let eventEmitted = false;
    let expectedId = 0;

    let event = manageStore.LogProductAdded();
    await event.watch((err, res) => {
      product_id = res.args._productId;
      eventEmitted = true;
    });

    await manageStore.addProductToStore(store_id, ipfsHash, price, quantity, {
      from: storeOwner
    });

    assert.equal(
      product_id,
      expectedId,
      "the productId of the last added product does not match the expected value"
    );
    assert.equal(
      eventEmitted,
      true,
      "adding a product should emit a Log Product Added event"
    );
  });

});