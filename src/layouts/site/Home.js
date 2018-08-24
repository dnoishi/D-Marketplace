import React, { Component } from "react";
import Jumbotron from "../../components/site/Jumbotron";
import StoreList from "../../components/store/StoreList";
import StoreOwner from "../../components/manage/StoreOwner";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerStores: [],
      marketplaceStores: []
    };
  }

  componentDidMount() {
    if (this.props.instance !== null){
      if(this.props.isStoreOwner){
        this.loadOwnerStores();
      }else{
        this.loadMarketplaceStores();
      }
    } 
  }

  componentDidUpdate(prevProps) {
    if (this.props.instance !== prevProps.instance) {
      if(this.props.isStoreOwner){
        this.loadOwnerStores();
      }else{
        this.loadMarketplaceStores();
      }
    }
  }

  loadOwnerStores = async () => {
    const {isStoreOwner} = this.props;
    const stores = [];
      let storesOfOwner = await this.props.instance.getStoresByOwner.call(this.props.account);
      for (const element of storesOfOwner) {
        const id = element.c[0];
        const info = await this.props.instance.stores.call(id);
        const metadataHash = this.props.web3.toAscii(info[0]);
        const balance = info[1].c[0];
        
        const store = {
          id,
          metadataHash,
          isStoreOwner,
          balance
        };
        stores.push(store);

      }

      this.setState({ ownerStores: stores });
  }

  loadMarketplaceStores = async () => {
    const {isStoreOwner} = this.props;
    const stores = [];

     let total = await this.props.instance.getStoreCount.call(
        this.props.account
      );
      
      if (total.c[0]) {
        for (let i = 0; i < total; i++) {
          const id = i;
          const info = await this.props.instance.stores.call(i);
          const metadataHash = this.props.web3.toAscii(info[0]);
          const balance = info[1].c[0];
  
          const store = {
            id,
            isStoreOwner,
            metadataHash,
            balance
          };
          stores.push(store);
        }
      }

    this.setState({ marketplaceStores: stores });
  };

  renderHome(){
    const { isAdmin, isStoreOwner } = this.props;
    const { marketplaceStores, ownerStores } = this.state;

    if(isAdmin){
      return (
        <main role="main">
          <Jumbotron
            title="Manage Owners"
            subtitle="Add or remove store owners to the marketplace."
          />
          <div className="container-fluid">
            <StoreOwner web3={this.props.web3}
                    account={this.props.account}
                    instance={this.props.instance} />
          </div>
        </main>
      );    
    } else if (isStoreOwner){
      return (
        <main role="main">
          <Jumbotron
            title="Manage Stores"
            subtitle="Add or remove stores to the marketplace."
          />
          <div className="container-fluid">
            <Link className="btn btn-primary" to="/add-store">
                Add Store
            </Link>
            <br/><br/>
            <StoreList title="My Store List" list={ownerStores} isStoreOwner={isStoreOwner} />
          </div>
        </main>
      ); 
    } else{
      return(
        <main role="main">
          <Jumbotron
            title="Welcome"
            subtitle="This is your descentralized marketplace!"
          />
          <div className="container-fluid">
            <StoreList title="Marketplace" list={marketplaceStores} isStoreOwner={isStoreOwner} />
          </div>
        </main>
      );
    }

  }

  render() {
    return(
      <div>
        {this.renderHome()}
      </div>
    );
   
  }
}

export default Home;
