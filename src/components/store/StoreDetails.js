import React, { Component } from "react";
import ProductList from "../product/ProductList";
import Jumbotron from "../../components/site/Jumbotron";
import { Link } from "react-router-dom";

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
      productCount: null
    };
  }

  componentDidMount() {
    const { store } = this.props.location.state;

    this.setState({
      id: store.id,
      isOwner: store.isStoreOwner,
      storeName: store.storeName,
      description: store.description,
      balance: store.balance
    });

    if (this.props.instance !== null) {
      this.loadProducts(store.id);
    }

  }

  componentDidUpdate(prevProps) {
    if (this.props.instance !== prevProps.instance) {
      const { store } = this.props.location.state;
      this.loadProducts(store.id);
    }
  }

  loadProducts = async id => {
    const products = [];
    let productsOfStore = await this.props.instance.getStoreProducts.call(id);
    for (const element of productsOfStore) {
      const id = element.c[0];
      const info = await this.props.instance.products.call(id);
      const metadataHash = this.props.web3.toAscii(info[0]);
      const price = info[1].c[0];
      const quantity = info[1].c[0];

      const product = {
        id,
        metadataHash,
        price,
        quantity
      };
      products.push(product);
    }

    this.setState({ products });
  };

  renderAddButton(){
    const { id, storeName, isOwner } = this.state;

    if(isOwner){
      return(
        <Link
              to={{
                pathname: "/add-product",
                state: { id, isOwner, storeName }
              }}
              className="btn btn-primary"
            >
              Add Product
            </Link>
      )
    }
  }

  render() {
    const { products, storeName, description, isOwner } = this.state;
      return (
        <div>
          <Jumbotron title={storeName} subtitle={description} />
          <div className="container">
            {this.renderAddButton()}
            <br /><br />
            <ProductList title="Products" list={products} isOwner={isOwner}/>
          </div>
        </div>
      );
  }
}

export default StoreDetails;
