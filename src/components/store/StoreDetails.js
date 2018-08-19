import React, { Component } from "react";
import ProductList from "../product/ProductList";
import Jumbotron from "../../components/site/Jumbotron";

class StoreDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    /*const {
      match: { params }
    } = this.props;*/

    //TODO: Get store details from our contract and display it here!
    // Also get the list of products of this store
    // Store id comes from ${params.storeId}

    //loading sample products
    this.loadProducts();
  }

  loadProducts = async () => {
    // TODO: Load the lists of stores that our contract has
    // this.state.stores expects an array of objects with these attributes:
    // {
    //   id: "store Id",
    //   idOwner: "owner address or id",
    //   title: "token attribute",
    //   description
    //   metadataHash: "store attributes",
    // }

    // Example:
    const product = {
      id: 1,
      title: "My Product",
      description: "My sample product in the marketplace",
      price: 3,
      metadataHash: "METADATA"
    };
    const list = [product];
    this.setState({ products: list });
  };

  render() {
    const { products } = this.state;
    return (
      <div>
        <Jumbotron title="Store Name" subtitle="Store Description!" />
        <div className="container">
          <ProductList title="Products" list={products} />
        </div>
      </div>
    );
  }
}

export default StoreDetails;
