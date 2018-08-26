var Marketplace = artifacts.require("./Marketplace.sol");
const { assertRevert } = require('./helpers/assertRevert');

contract("Marketplace", accounts => {

  const owner = accounts[0];
  const storeOwner = accounts[1];
  const buyer = accounts[2];
  const other = accounts[3];

  const ipfsHash = 0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231;
  const price = web3.toWei(2, "ether");
  const quantity = 10;
  const storeId = 0;
  const productId = 0;

  let storeA = '';
  let storeB = '';

  /// @notice Validates that in order to buy a product you need to send the correct value.
  it("need to send correct value to buy product", async () => {
    const marketplace = await Marketplace.deployed();
    let amount = web3.toWei(1, "ether");

    await marketplace.registerOwner(storeOwner, { from: owner });
    await marketplace.addStore(ipfsHash, { from: storeOwner });
    await marketplace.addProductToStore(storeId, ipfsHash, price, quantity, { from: storeOwner });

    await assertRevert(marketplace.buyProduct(productId, { from: buyer, value: amount }));
  });

  /// @notice Checks that purchase can be made and it's amount is added to the contract balance and the store balance.
  it("buyer can buy a product from the store", async () => {
    const marketplace = await Marketplace.deployed();

    let eventEmitted = false;
    let expectedBuyer;
    let amount = web3.toWei(2, "ether");

    storeB = await marketplace.stores.call(storeId);

    let buyerBalanceBefore = await web3.eth.getBalance(buyer).toNumber();
    let contractBalanceBefore = await web3.eth.getBalance(marketplace.address).toNumber();
    let storeBalanceBefore = storeB[1].toNumber();

    let event = marketplace.LogProductSold();
    await event.watch((err, res) => {
      expectedBuyer = res.args.buyer;
      eventEmitted = true;
    });

    await marketplace.buyProduct(productId, { from: buyer, value: amount });

    let buyerBalanceAfter = await web3.eth.getBalance(buyer).toNumber();
    let contractBalanceAfter = await web3.eth.getBalance(marketplace.address).toNumber();
    storeA = await marketplace.stores.call(storeId);
    let storeBalanceAfter = storeA[1].toNumber();

    assert.equal(expectedBuyer, buyer, "the address of the product buyer does not match the expected value");
    assert.equal(contractBalanceAfter, contractBalanceBefore + price, 
      "contract's balance should be increased by the price of the product");
    assert.equal(storeBalanceAfter, storeBalanceBefore + price, 
      "store's balance should be increased by the price of the product");
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

  /**
   * These next functions are validated here because 
   * I need it the marketplace instance in other to have the store balance greater than 0.
   * And that's only possible after purchases.
   */

  /// @notice Checks that only store owners can call the withdrawStoreFunds func.
  it("only store owner can withdraw its store balance", async () => {
    const marketplace = await Marketplace.deployed();
    await assertRevert(marketplace.withdrawStoreFunds(storeId, { from: other }));
  });


  /// @notice Validates that a store owner can withdraw only its own store balance.
  it("store owner can withdraw only its store balance", async () => {
    const marketplace = await Marketplace.deployed();
    let other_store_id = 1;
    
    await assertRevert(marketplace.withdrawStoreFunds(other_store_id, { from: storeOwner }));
  });

  /// @notice Checks withdrawal func and validates that store funds a deducted and validates contracts balance.
  it("store owner can withdraw a store balance", async () => {
    const marketplace = await Marketplace.deployed();

    let eventEmitted = false;
    let expectedBalance = 0;
    let amountWithdrawed = 0;

    let ownerBalanceBefore = await web3.eth.getBalance(storeOwner).toNumber();
    let contractBalanceBefore = await web3.eth
      .getBalance(marketplace.address)
      .toNumber();
    storeB = await marketplace.stores.call(storeId);
    let storeBalanceBefore = storeB[1].toNumber();

    let event = marketplace.LogStoreWithdrawed();
    await event.watch((err, res) => {
      amountWithdrawed = res.args._balance.toNumber();
      eventEmitted = true;
    });

    await marketplace.withdrawStoreFunds(storeId, { from: storeOwner });

    let ownerBalanceAfter = await web3.eth.getBalance(storeOwner).toNumber();
    let contractBalanceAfter = await web3.eth
      .getBalance(marketplace.address)
      .toNumber();
    storeA = await marketplace.stores.call(storeId);
    let storeBalanceAfter = storeA[1].toNumber();

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
