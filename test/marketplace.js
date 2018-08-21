var Marketplace = artifacts.require("./Marketplace.sol");

contract("Marketplace", accounts => {
  const owner = accounts[0];
  const admin = accounts[1];
  const storeOwner = accounts[2];
  const buyer = accounts[3];
  const emptyAddress = "0x0000000000000000000000000000000000000000";
  const emptyString = "";
  const ipfsHash = 0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231;

  let product_id;
  let store_id;
  let added_address;

  const price = web3.toWei(1, "ether");
  const quantity = 10;

  it("sets an owner", async () => {
    const marketplace = await Marketplace.new();
    assert.equal(await marketplace.owner.call(), owner);
  });

  it("contract owner can add an admin", async () => {
    const marketplace = await Marketplace.deployed();

    let eventEmitted = false;

    let event = marketplace.LogAddressAdded();
    await event.watch((err, res) => {
      added_address = res.args._address;
      eventEmitted = true;
    });

    await marketplace.registerAdmin(admin, { from: owner });

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
    const marketplace = await Marketplace.deployed();

    let eventEmitted = false;

    let event = marketplace.LogAddressAdded();
    await event.watch((err, res) => {
      added_address = res.args._address;
      eventEmitted = true;
    });

    await marketplace.registerOwner(storeOwner, { from: admin });

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

  it("store owner can add a store front", async () => {
    const marketplace = await Marketplace.deployed();

    let eventEmitted = false;
    let expectedId = 0;

    let event = marketplace.LogStoreAdded();
    await event.watch((err, res) => {
      added_address = res.args._owner;
      store_id = res.args._storeId;
      eventEmitted = true;
    });

    await marketplace.addStore(ipfsHash, { from: storeOwner });

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

  it("store owner can add a product to the store", async () => {
    const marketplace = await Marketplace.deployed();

    let eventEmitted = false;
    let expectedId = 0;

    let event = marketplace.LogProductAdded();
    await event.watch((err, res) => {
      product_id = res.args._productId;
      eventEmitted = true;
    });

    await marketplace.addProductToStore(store_id, ipfsHash, price, quantity, {
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

  it("buyer can buy a product from the store", async () => {
    const marketplace = await Marketplace.deployed();

    let eventEmitted = false;
    let expectedBuyer;
    let amount = web3.toWei(2, "ether");

    let storeb = await marketplace.stores.call(store_id);

    let buyerBalanceBefore = await web3.eth.getBalance(buyer).toNumber();
    let contractBalanceBefore = await web3.eth
      .getBalance(marketplace.address)
      .toNumber();
    let storeBalanceBefore = storeb[1].toNumber();

    let event = marketplace.LogProductSold();
    await event.watch((err, res) => {
      expectedBuyer = res.args.buyer;
      eventEmitted = true;
    });

    await marketplace.buyProduct(product_id, { from: buyer, value: amount });

    let buyerBalanceAfter = await web3.eth.getBalance(buyer).toNumber();
    let contractBalanceAfter = await web3.eth
      .getBalance(marketplace.address)
      .toNumber();
    let storea = await marketplace.stores.call(store_id);
    let storeBalanceAfter = storea[1].toNumber();

    assert.equal(
      expectedBuyer,
      buyer,
      "the address of the product buyer does not match the expected value"
    );
    assert.equal(
      contractBalanceAfter,
      contractBalanceBefore + price,
      "contract's balance should be increased by the price of the product"
    );
    assert.equal(
      storeBalanceAfter,
      storeBalanceBefore + price,
      "store's balance should be increased by the price of the product"
    );
    assert.isBelow(
      buyerBalanceAfter,
      buyerBalanceBefore - price,
      "buyer's balance should be reduced by more than the price of the product (including gas costs)"
    );
    assert.equal(
      eventEmitted,
      true,
      "adding a product should emit a Log Product Sold event"
    );
  });

  it("store owner can withdraw a store balance", async () => {
    const marketplace = await Marketplace.deployed();

    let eventEmitted = false;
    let expectedBalance = 0;
    let amountWithdrawed = 0;

    let ownerBalanceBefore = await web3.eth.getBalance(storeOwner).toNumber();
    let contractBalanceBefore = await web3.eth
      .getBalance(marketplace.address)
      .toNumber();
    let storeb = await marketplace.stores.call(store_id);
    let storeBalanceBefore = storeb[1].toNumber();

    let event = marketplace.LogStoreWithdrawed();
    await event.watch((err, res) => {
      amountWithdrawed = res.args._balance.toNumber();
      eventEmitted = true;
    });

    await marketplace.withdrawStoreFunds(store_id, { from: storeOwner });

    let ownerBalanceAfter = await web3.eth.getBalance(storeOwner).toNumber();
    let contractBalanceAfter = await web3.eth
      .getBalance(marketplace.address)
      .toNumber();
    let storea = await marketplace.stores.call(store_id);
    let storeBalanceAfter = storea[1].toNumber();

    assert.equal(
      amountWithdrawed,
      storeBalanceBefore,
      "the amount withdawed needs to be the same with the store balance"
    );
    assert.isBelow(
      ownerBalanceAfter,
      ownerBalanceBefore + amountWithdrawed,
      "the owner balance should be increased by the amount withdrawed and decreased the gas cost"
    );
    assert.equal(
      storeBalanceAfter,
      expectedBalance,
      "the store balance need to be 0"
    );
    assert.equal(
      contractBalanceAfter,
      contractBalanceBefore - amountWithdrawed,
      "contract's balance should be decreased by the amount withdrawed"
    );
    assert.equal(
      eventEmitted,
      true,
      "adding a store should emit a Log Store Withdrawed event"
    );
  });
});
