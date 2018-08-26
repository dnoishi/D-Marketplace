import React, { Component } from "react";
import Navbar from "./components/site/Navbar";
import Footer from "./components/site/Footer";

//import Marketplace from "../build/contracts/Marketplace.json";
import "./css/font-awesome.min.css"
import "./App.css";

//const contract = require("truffle-contract");
//const marketplace = contract(Marketplace);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAccount: null
    };
  }

  componentWillMount() {
    // Get user account
    this.setupAccount();
  }
  
  setupAccount() {
    this.props.web3.eth.getAccounts((error, accts) => {
      if (accts === undefined || accts.length === 0) {
        alert("No account(s) available");
      } else {
        this.setState({
          selectedAccount: accts.length > 0 ? accts[0] : null
        });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <Navbar web3={this.props.web3} account={this.state.selectedAccount} />

        <Footer />
      </div>
    );
  }
}

export default App;
