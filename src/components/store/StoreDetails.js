import React, { Component } from "react";
import ProductList from "../product/ProductList";
import Jumbotron from "../../components/site/Jumbotron";

class StoreDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isOwner: false,
      id: null,
      storeName: "",
      description: "",
      balance: null,
      productCount: null,
      web3: null,
      instance: null
    };
  }

  componentDidMount() {
    const { store, account, web3, instance } = this.props.location.state;
    if (store.ownerAddress === account) this.setState({ isOwner: true });

    this.setState({
      id: store.id,
      storeName: store.storeName,
      description: store.description,
      balance: store.balance,
      productCount: store.productCount,
      web3: web3,
      instance: instance
    });

    this.loadProducts();
  }

  loadProducts = async () => {
    //let total = this.state.productCount;
    /*if (total) {
      for (let i = 0; i < total; i++) {
        const id = await this.state.instance.productToStore.call(i);
      }
    }

    /*
      let total = await this.props.instance.getStoreCount.call(
      this.props.account
    );

    const stores = [];
    if (total.c[0]) {
      for (let i = 0; i < total; i++) {
        const id = i;
        const ownerAddress = await this.props.instance.storeToOwner.call(i);
        const productCountInf = await this.props.instance.storeProductCount.call(
          i
        );
        const productCount = productCountInf.c[0];
        const info = await this.props.instance.stores.call(i);
        const metadataHash = this.props.web3.toAscii(info[0]);
        const balance = info[1].c[0];

        const store = {
          id,
          ownerAddress,
          productCount,
          metadataHash,
          balance
        };
        stores.push(store);
      }
    }

    this.setState({ stores });
    */
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
    const { products, storeName, description, balance } = this.state;
    return (
      <div>
        <Jumbotron title={storeName} subtitle={description} />
        <div className="container">
          <ProductList title="Products" list={products} />
        </div>
      </div>
    );
  }
}

export default StoreDetails;
