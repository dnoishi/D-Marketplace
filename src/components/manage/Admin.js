import React, { Component } from "react";
import AddForm from "./AddForm";
import Jumbotron from "../../components/site/Jumbotron";
import Marketplace from "../../../build/contracts/Marketplace.json";

const contract = require("truffle-contract");
const marketplace = contract(Marketplace);

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = { adminList: [], isSubmitting: false };

    marketplace.setProvider(this.props.web3.currentProvider);
  }

  componentDidMount() {
    this.loadAdminList();
  }

  componentWillUpdate(prevState){
    if(this.state.adminList !== prevState.adminList){
      this.loadAdminList();
    }
  }

  addAdmin = address => {
    this.setState({ isSubmitting: true });
    this.props.instance.registerAdmin
      .estimateGas(address, {
        from: this.props.account
      })
      .then(estimatedGas => {
        return this.props.instance.registerAdmin(address, {
          from: this.props.account,
          gas: estimatedGas + 1000
        });
      })
      .then(receipt => {
        console.log(receipt);
        this.loadAdminList();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  };

  removeAdmin = address => {
    this.setState({ isSubmitting: true });
    this.props.instance.removeAdmin
      .estimateGas(address, {
        from: this.props.account
      })
      .then(estimatedGas => {
        return this.props.instance.removeAdmin(address, {
          from: this.props.account,
          gas: estimatedGas + 100000
        });
      })
      .then(receipt => {
        console.log(receipt);
        this.loadAdminList();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  };

  loadAdminList = async () => {
    let total = await this.props.instance.getAdminCount.call(
      this.props.account
    );

    const adminList = [];
    if (total.c[0]) {
      for (let i = 0; i < total; i++) {
        const id = i;
        const address = await this.props.instance.AdminAddresses.call(i);

        const admin = {
          id,
          address
        };

        adminList.push(admin);
      }
    }
    // Get the list of avaliable admins.
    this.setState({ adminList });
  };

  render() {
    let row = this.state.adminList.map(admin => {
      return (
        <AdminRow
          key={admin.id}
          data={admin}
          submit={this.removeAdmin}
          isSubmitting={this.state.isSubmitting}
        />
      );
    });
    return (
      <div>
        <Jumbotron
          title="Manage Admin"
          subtitle="Add admin to the marketplace."
        />

        <main className="container">
          <h3>Add Admin</h3>
          <AddForm
            submit={this.addAdmin}
            isSubmitting={this.state.isSubmitting}
          />
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
          {this.state.adminList.length === 0 ? <p>No admins available</p> : ""}
        </main>
      </div>
    );
  }
}

const AdminRow = props => {
  return (
    <tr>
      <td scope="row">{props.data.id}</td>
      <td>{props.data.address}</td>
      <td>
        <button
          type="button"
          disabled={props.isSubmitting}
          className="btn btn-danger"
          onClick={() => props.submit(props.data.address)}
        >
          <i className="fa fa-trash-o" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
};

export default Admin;
