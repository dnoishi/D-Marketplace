## What is D-Marketplace.

* __This project is my implementation of the final project idea - online marketplace.__

D-Marketplace is an Ethereum Decentralized Application (DApp) that enables to easily set up an online marketplace that runs on the blockchain.

Once deployed the **marketplace owner** can easily authorize specific addresses to have different roles such as **administrator** or **store owner**.

The marketplace can be managed by a group of **Administrators** that the marketplace owner can easily set up.

An approved administrator opens the web app. The web app reads the address and identifies that the user is an admin, showing them admin only functions, such as managing **store owners**. An administrator can add or remove an address from the list of approved store owners.

An approved store owner opens the web app. The web app recognizes their address and identifies them as a store owner. They are shown the store owner functions. They can create a new storefront that will be displayed on the marketplace. They can also see the storefronts that they have already created. They can click on a storefront to manage it. They can add/remove products to the storefront or change any of the products’ prices. They can also withdraw any funds that the store has collected from sales.

When a user that isn't either store owner or administrator opens the website, the site recognises it as a **shopper** and displays all the stores available on the marketplace, when the shopper clicks on a storefront, it will take them to a product page where they can see the store's available products, including their price and quantity. Shoppers can purchase a product, which will debit their account and send it to the store.

### Tech Stack

 - Truffle Suite for contract deployment and management.
 - ReactJS and Bootstrap 4 for the frontend development and design. 
 - IPFS for decentralized storage.


## Installation (How to set it up)

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Install Node Packages.
    ```javascript
    npm install
    ```
    
3. Run ganache-cli in the console.
    ```javascript
    ganache-cli
    ```

4. Run the tests.
    ```javascript
    truffle test
    ```

5. Compile and migrate the smart contracts.
    ```javascript
    truffle compile
    truffle migrate
    ```

6. Run the webpack server for front-end hot reloading (outside the development console).
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run start
    ```
