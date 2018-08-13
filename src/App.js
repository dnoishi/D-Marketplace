import React, { Component } from "react";
import { Route } from "react-router-dom";
import Home from "./layouts/site/Home";
import About from "./layouts/site/About";
import Contact from "./layouts/site/Contact";
import Navbar from "./components/site/Navbar";
import Footer from "./components/site/Footer";
import StoreDetails from "./components/store/StoreDetails";
//import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      isOwner: false,
      isAdmin: false
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  isAdmin() {
    // TODO: determine if we are a contract admin
    this.setState({ isAdmin: false });
  }

  isOwner() {
    // TODO: determine if we are a store owner
    this.setState({ isOwner: true });
  }

  instantiateContract() {}

  render() {
    return (
      <div className="App">
        <Navbar />
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/stores/:storeId" component={StoreDetails} />
        <Footer />
      </div>
    );
  }
}

export default App;
