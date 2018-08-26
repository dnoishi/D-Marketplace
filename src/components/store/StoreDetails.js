import React, { Component } from "react";
import ProductList from "../product/ProductList";
import Jumbotron from "../../components/site/Jumbotron";
import { Link, Redirect } from "react-router-dom";
import ipfs from "../../utils/ipfs";

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
      isSubmitting: false,
      toHome: false
    };
  }

  componentDidMount() {
    
    const { storeId } = this.props.match.params;
    if(this.props.instance !== null){
      this.loadStoreDetails(storeId);
    }

    if (this.props.instance !== null) {
      this.loadProducts(storeId);
    }

  }

  loadStoreDetails = async (storeId) => {

    const { instance, account, web3 } = this.props;
    const isOwner = await instance.isStoreOwner.call(account);
    const info = await instance.stores.call(storeId);
    const metadataHash = await web3.toAscii(info[0]);
    const balance = info[1].c[0];

    ipfs.files.get(metadataHash).then(r => {
      const jsonMetadata = JSON.parse(r[0].content);
        this.setState({
          id: storeId,
          isOwner: isOwner,
          storeName: jsonMetadata.storeName,
          description: jsonMetadata.description,
          balance: balance
        });
    });

  }

  componentDidUpdate(prevProps) {
    if (this.props.instance !== prevProps.instance) {
      const { storeId } = this.props.match.params;
      this.loadStoreDetails(storeId)
      this.loadProducts(storeId);
    }
  }

  loadProducts = async id => {
    const products = [];
    const storeId = id;
    let productsOfStore = await this.props.instance.getStoreProducts.call(id);
    for (const element of productsOfStore) {
      const id = element.c[0];
      const info = await this.props.instance.products.call(id);
      const metadataHash = this.props.web3.toAscii(info[0]);
      const price = info[1].toNumber();
      const quantity = info[2].toNumber();

      const product = {
        id,
        storeId,
        metadataHash,
        price,
        quantity
      };
      products.push(product);
    }

    this.setState({ products });
  };


  withdrawFunds = e => {
    this.setState({ isSubmitting: true });
    const {id} = this.state;
    const {instance, account } = this.props;
    e.preventDefault();
    
    instance.withdrawStoreFunds.estimateGas(id, { from: account })
      .then(estimatedGas => {
        return instance.withdrawStoreFunds(id, { from: account, gas: estimatedGas + 10000 });
      })
      .then(receipt => {
        console.log(receipt.receipt);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false, toHome: true });
      });
  };

  renderStoreButtons(){
    const { id, storeName, isOwner, balance } = this.state;

    if(isOwner){
      return(
        <div className="row">
          <div className="col-md-6">
            <Link to={{ pathname:`/store/${id}/add-product`, state: { id, isOwner, storeName }}}
              className="btn btn-primary" >
              Add Product
            </Link>
          </div>
          <div className="col-md-auto">
            Store Balance: {balance}  |
            { balance ? 
               <button onClick={this.withdrawFunds} className="btn btn-warning">Withdraw funds</button> 
              : ''
            }
          </div>
        </div>
        
      )
    }
  }

  render() {
    if (this.state.toHome === true) {
      return <Redirect to='/' push/>
    }
    const { products, storeName, description, isOwner } = this.state;
    const {instance, account, web3} = this.props;
      return (
        <div>
          <Jumbotron title={storeName} subtitle={description} />

          <div className="container">
              {this.renderStoreButtons()}
            <br /><br />
            <ProductList title="Products" web3={web3}
            instance={instance} account={account} list={products} isOwner={isOwner} />
          </div>
        </div>
      );
  }
}

export default StoreDetails;
