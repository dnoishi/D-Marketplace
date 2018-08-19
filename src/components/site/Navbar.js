import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from "react-router-dom";
import Home from "../../layouts/site/Home";
import About from "../../layouts/site/About";
import Contact from "../../layouts/site/Contact";
import StoreDetails from "../store/StoreDetails";
import AddStore from "../store/AddStore";
import Admin from "../manage/Admin";
import StoreOwner from "../manage/StoreOwner";
import Marketplace from "../../../build/contracts/Marketplace.json";

import "./Navbar.css";

const contract = require("truffle-contract");
const marketplace = contract(Marketplace);

const SecretRoute = ({ isAuth, ...props }) =>
  isAuth ? <Route {...props} /> : <Redirect to="/" />;

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStoreOwner: false,
      isContractOwner: false,
      isAdmin: false
    };

    marketplace.setProvider(this.props.web3.currentProvider);
  }
  componentWillMount() {
    this.checkAdminRigths();
  }

  checkAdminRigths = async () => {
    // TODO: determine if we are a store owner
    const marketplaceInstance = await marketplace.deployed();
    let ownerAddress = await marketplaceInstance.owner.call();
    if (ownerAddress === this.props.account) {
      this.setState({ isContractOwner: true, isAdmin: true });
    } else {
      let isAdmin = await marketplaceInstance.isAdmin.call(this.props.account);
      if (isAdmin) {
        this.setState({ isAdmin });
      } else {
        let isStoreOwner = await marketplaceInstance.isStoreOwner.call(
          this.props.account
        );
        if (isStoreOwner) this.setState({ isStoreOwner });
      }
    }
  };

  render() {
    const { isContractOwner, isStoreOwner, isAdmin } = this.state;
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="container">
              <Link className="navbar-brand" to="/">
                D-Marketplace
              </Link>

              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item active">
                    <Link className="nav-link" to="/">
                      Home <span className="sr-only">(current)</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      About
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/contact">
                      Contact
                    </Link>
                  </li>
                  <li className="nav-item" hidden={!isContractOwner}>
                    <Link className="nav-link" to="/manage-admins">
                      Manage Admin
                    </Link>
                  </li>
                  <li className="nav-item" hidden={!isAdmin}>
                    <Link className="nav-link" to="/manage-owners">
                      Manage Owner
                    </Link>
                  </li>
                  <li className="nav-item" hidden={!isStoreOwner}>
                    <Link className="nav-link" to="/add-store">
                      Manage Store
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/about" exact component={About} />
              <Route path="/contact" exact component={Contact} />
              <Route path="/stores/:storeId" exact component={StoreDetails} />
              <SecretRoute
                isAuth={isContractOwner}
                path="/manage-admins"
                exact
                render={() => (
                  <Admin web3={this.props.web3} account={this.props.account} />
                )}
              />
              <SecretRoute
                isAuth={isAdmin}
                path="/manage-owners"
                exact
                render={() => (
                  <StoreOwner
                    web3={this.props.web3}
                    account={this.props.account}
                  />
                )}
              />
              <SecretRoute
                isAuth={isStoreOwner}
                path="/add-store"
                exact
                render={() => (
                  <AddStore
                    web3={this.props.web3}
                    account={this.props.account}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default Navbar;
