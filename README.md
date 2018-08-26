## What is D-Marketplace.

* __This project is my implementation of the final project idea - online marketplace.__

D-Marketplace is an Ethereum Decentralized Application (DApp) that enables to easily set up an online marketplace that runs on the blockchain.

Once deployed, the **marketplace owner** can easily authorize specific addresses to have different roles such as **administrator** or **store owner**.

The marketplace can be managed by a group of **Administrators** that the marketplace owner can easily set up.

Opening the web app as an approved administrator displays only admin functionalities, such as managing **store owners**. Within this view, they can see a list of approved store owners, having the options to add or remove addresses to the list. 

On the other hand, opening the web app as an approved store owner displays only store owner functionalities, such as managing its stores. Within this view, they can create new storefronts that will be displayed in the marketplace once created. Also, they can view the list of created storefronts and click on each one to manage it. Once managing a specific storefront, the store owners can add, update, or remove products to the storefront. The product update functionality is limited to only update the product price and quantity. Finally, they can withdraw all the funds collected from sales of a specific store.

Every time a user that isn't either the store owner or administrator opens the website, it is recognized as a **shopper** and the site displays the stores available on the marketplace. Whenever the shopper clicks on a storefront, it will take them to a product page where they can see the store's available products, including their price and quantity. Shoppers can purchase a product, starting a transaction between him and the store.

### Tech Stack

 - Truffle Suite for contract deployment and management.
 - ReactJS and Bootstrap 4 for the frontend development and design. 
 - IPFS for decentralized storage.


## Installation (How to set it up)

1. Clone the repo, move into the directory and install the node packages.
    ```sh
    git clone https://github.com/natachadelarosa/ndelarosa
    cd ndelarosa
    npm install
    ```

2. Install Truffle and Ganache-Cli globally.
    ```sh
    npm install -g truffle
    npm install -g ganache-cli
    ```
    
3. Run ganache-cli in the console.
    ```sh
    ganache-cli
    ```

4. Run the tests.
    ```sh
    truffle test
    ```

5. Compile and migrate the smart contracts.
    ```sh
    truffle compile
    truffle migrate --reset
    ```

6. Run the webpack server for front-end hot reloading (outside the development console).
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run start
    ```
