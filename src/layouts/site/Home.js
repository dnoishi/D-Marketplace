import React, { Component } from "react";
import Jumbotron from "../../components/site/Jumbotron";
import StoreList from "../../components/store/StoreList";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: []
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.instance !== prevProps.instance) {
      this.loadStores();
    }
  }

  loadStores = async () => {
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
  };

  render() {
    const { stores } = this.state;
    const { web3, account, instance } = this.props;
    return (
      <main role="main">
        <Jumbotron
          title="Welcome"
          subtitle="This is your descentralized marketplace!"
        />
        <div className="container">
          <StoreList
            title="Marketplace"
            list={stores}
            web3={web3}
            account={account}
            instance={instance}
          />
        </div>
      </main>
    );
  }
}

export default Home;
