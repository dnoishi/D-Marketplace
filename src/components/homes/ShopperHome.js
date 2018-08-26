import React, { Component } from 'react';
import Jumbotron from '../site/Jumbotron';
import StoreList from '../store/StoreList';

class ShopperHome extends Component {

    constructor(props) {
        super(props);
        this.state = { marketplaceStores: [] };
    }

    componentDidMount() {
        if (this.props.instance !== null){
            this.loadMarketplaceStores();
        } 
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.account !== prevProps.account) {
          this.loadMarketplaceStores();
        }
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
              const balance = this.props.web3.fromWei(info[1].toNumber(), "ether");
      
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
    }

    render() {
        return (
            <main role="main">
                <Jumbotron
                title="Welcome"
                subtitle="This is your descentralized marketplace!"
                />
                <div className="container">
                <StoreList title="Marketplace" list={this.state.marketplaceStores} 
                    isStoreOwner={this.props.isStoreOwner} />
                </div>
            </main>
        );
    }
}

export default ShopperHome;