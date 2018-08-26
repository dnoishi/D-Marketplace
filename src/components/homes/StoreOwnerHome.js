import React, { Component } from 'react';
import Jumbotron from '../site/Jumbotron';
import StoreList from '../store/StoreList';
import { Link } from 'react-router-dom';

class StoreOwnerHome extends Component {
    constructor(props) {
        super(props);
        this.state = { ownerStores: [] };
    }

    componentDidMount() {
        if (this.props.instance !== null){
            this.loadOwnerStores();
        } 
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.isStoreOwner !== prevProps.isStoreOwner) {
          this.loadOwnerStores();
        }
    }

    loadOwnerStores = async () => {
        const {isStoreOwner} = this.props;
        const stores = [];
          let storesOfOwner = await this.props.instance.getStoresByOwner.call(this.props.account);
          for (const element of storesOfOwner) {
            const id = element.c[0];
            const info = await this.props.instance.stores.call(id);
            const metadataHash = await this.props.web3.toAscii(info[0]);
            const balance = this.props.web3.fromWei(info[1].toNumber(), "ether");
            
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
    render() {
        return (
            <main role="main">
                <Jumbotron
                title="Manage Stores"
                subtitle="Add or remove stores to the marketplace."
                />
                <div className="container">
                <Link className="btn btn-primary" to="/add-store">
                    Add Store
                </Link>
                <br/><br/>
                <StoreList title="My Store List" list={this.state.ownerStores}  isStoreOwner={this.props.isStoreOwner}  />
                </div>
            </main>
        );
    }
}

export default StoreOwnerHome;