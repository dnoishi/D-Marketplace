import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from "react-router-dom";
import Home from "../homes/Home";
import StoreDetails from "../store/StoreDetails";
import AddStore from "../store/AddStore";
import Admin from "../manage/Admin";
import AddProduct from "../product/AddProduct";
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
      isAdmin: false,
      instance: null
    };

    marketplace.setProvider(this.props.web3.currentProvider);
  }

  componentWillMount() {
    this.checkRights();
  }

  componentDidUpdate(prevProps) {
    if(this.props.account !== prevProps.account)
      this.checkRights();
  }

  checkRights = async () => {
    // TODO: determine if we are a store owner
    const marketplaceInstance = await marketplace.deployed();
    this.setState({ instance: marketplaceInstance });
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
    const { isContractOwner, isAdmin, isStoreOwner } = this.state;
    const { account } = this.props;
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
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                D-Marketplace
              </Link>

              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item" hidden={!isContractOwner}>
                    <Link className="nav-link" to="/manage-admins">
                      Manage Admin
                    </Link>
                  </li>
                  <li className="nav-item">
                    <span className="nav-link">
                      Logged as: {account}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div>
            <Switch>
              <Route
                path="/"
                exact
                render={() => (
                  <Home
                    isAdmin={isAdmin}
                    isStoreOwner={isStoreOwner}
                    web3={this.props.web3}
                    account={this.props.account}
                    instance={this.state.instance}
                  />
                )}
              />
              <Route
                exact
                path="/store/:storeId"
                render={props => (
                  <StoreDetails
                    {...props}
                    web3={this.props.web3}
                    account={this.props.account}
                    instance={this.state.instance}
                  />
                )}
              />
              <SecretRoute
                isAuth={isContractOwner}
                path="/manage-admins"
                exact
                render={() => (
                  <Admin
                    web3={this.props.web3}
                    account={this.props.account}
                    instance={this.state.instance}
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
                    instance={this.state.instance}
                  />
                )}
              />
              <SecretRoute
                isAuth={isStoreOwner}
                path="/store/:storeId/add-product"
                exact
                render={props=> (
                  <AddProduct
                    {...props}
                    web3={this.props.web3}
                    account={this.props.account}
                    instance={this.state.instance}
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
