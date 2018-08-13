import React, { Component } from "react";

class StoreDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      match: { params }
    } = this.props;

    //TODO: Get store details from our contract and displayit here!
    // Also get the list of products of this store
    // Store id comes from ${params.storeId}
  }

  render() {
    return (
      <div>
        <h2>Store Details</h2>
      </div>
    );
  }
}

export default StoreDetails;
