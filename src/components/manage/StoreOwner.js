import React, { Component } from "react";
import AddForm from "./AddForm";
import Jumbotron from "../../components/site/Jumbotron";
import Marketplace from "../../../build/contracts/Marketplace.json";

const contract = require("truffle-contract");
const marketplace = contract(Marketplace);

class StoreOwner extends Component {
  constructor(props) {
    super(props);

    this.state = { ownerList: [] };

    marketplace.setProvider(this.props.web3.currentProvider);
  }

  componentWillMount() {
    this.loadOwnerList();
  }

  componentDidUpdate() {
    this.loadOwnerList();
  }

  addOwner = async address => {
    const marketplaceInstance = await marketplace.deployed();
    await marketplaceInstance.registerOwner(address, {
      from: this.props.account
    });
  };

  removeOwner = async address => {
    console.log(address);
    const marketplaceInstance = await marketplace.deployed();
    await marketplaceInstance.removeOwner(address, {
      from: this.props.account
    });
  };

  loadOwnerList = async () => {
    const marketplaceInstance = await marketplace.deployed();
    let total = await marketplaceInstance.getStoreOwnersCount.call(
      this.props.account
    );

    const ownerList = [];
    if (total.c[0]) {
      for (let i = 0; i < total; i++) {
        const id = i;
        const address = await marketplaceInstance.OwnerAddresses.call(i);

        const owner = {
          id,
          address
        };

        ownerList.push(owner);
      }
    }
    // Get the list of avaliable admins.
    this.setState({ ownerList });
  };
  render() {
    let row = this.state.ownerList.map(owner => {
      return <Row key={owner.id} data={owner} submit={this.removeOwner} />;
    });
    return (
      <div>
        <Jumbotron
          title="Manage Owners"
          subtitle="Add owner to the marketplace."
        />

        <main className="container">
          <h3>Add Owner</h3>
          <AddForm submit={this.addOwner} />
          <br />
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Address</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
            <tbody>{row}</tbody>
          </table>
          {this.state.ownerList.length === 0 ? <p>No admins available</p> : ""}
        </main>
      </div>
    );
  }
}

const Row = props => {
  return (
    <tr>
      <td scope="row">{props.data.id}</td>
      <td>{props.data.address}</td>
      <td>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => props.submit(props.data.address)}
        >
          <i className="fa fa-trash-o" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
};

export default StoreOwner;
