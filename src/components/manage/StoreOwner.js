import React, { Component } from "react";
import AddForm from "./AddForm";

class StoreOwner extends Component {
  constructor(props) {
    super(props);

    this.state = { ownerList: [], isSubmitting: false };
  }

  componentDidMount() {
    this.loadOwnerList();
  }

  componentWillUpdate(prevState){
    if(this.state.ownerList !== prevState.ownerList){
      this.loadOwnerList();
    }
  }

  addOwner = address => {
    this.setState({ isSubmitting: true });
    this.props.instance.registerOwner
      .estimateGas(address, {
        from: this.props.account
      })
      .then(estimatedGas => {
        return this.props.instance.registerOwner(address, {
          from: this.props.account,
          gas: estimatedGas + 10000
        });
      })
      .then(receipt => {
        console.log(receipt);
        this.loadOwnerList();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  };

  removeOwner = address => {
    this.setState({ isSubmitting: true });
    this.props.instance.removeOwner
      .estimateGas(address, {
        from: this.props.account
      })
      .then(estimatedGas => {
        return this.props.instance.removeOwner(address, {
          from: this.props.account,
          gas: estimatedGas + 100000
        });
      })
      .then(receipt => {
        console.log(receipt);
        this.loadOwnerList();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  };

  loadOwnerList = async () => {
    let total = await this.props.instance.getStoreOwnersCount.call(
      this.props.account
    );

    const ownerList = [];
    if (total.c[0]) {
      for (let i = 0; i < total; i++) {
        const id = i;
        const address = await this.props.instance.OwnerAddresses.call(i);

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
      return (
        <Row
          key={owner.id}
          data={owner}
          submit={this.removeOwner}
          isSubmitting={this.state.isSubmitting}
        />
      );
    });
    return (
      <div>
        <main className="container">
          <h3>Add Store Owner</h3>
          <AddForm
            submit={this.addOwner}
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
          disabled={props.isSubmitting}
          onClick={() => props.submit(props.data.address)}
        >
          <i className="fa fa-trash-o" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
};

export default StoreOwner;
