# Design Pattern Decisions

Explanation of the Design patterns used.

### Ethereum Patterns used

* Restricting Access.
* Withdrawal.
* Circuit Breaker.
* Smart contract comments according to solidity documentation.

### Why these patterns

These patterns help us make the smart contract more secure and less susceptible to attacks.

* __Restricting Access__ allow us to use authorization control functions.

* __Withdrawal__ allow us to use a secure way to send ether from the contract.

* __Circuit Breaker__ allow us stop the contract if is hacked and we can destroy the contract if we couldn't recover from an attack and move the contract funds to the contract owner or a specified account.

### Ethereum Patterns that I would like to add

* Upgradeable contracts pattern using a proxy and an external storage.

### Why not others

These are the ones that I thought my contracts required and they give the security level that I was looking for.