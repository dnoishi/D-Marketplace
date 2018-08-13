var Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', accounts => {

    const [firstAccount] = accounts;

    it("sets an owner", async () => {
        const marketplace = await Marketplace.new();
        assert.equal(await marketplace.owner.call(), firstAccount);
    });
});