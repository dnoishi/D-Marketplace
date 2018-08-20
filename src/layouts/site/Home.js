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

  componentDidMount() {
    this.loadStores();
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
        const productCount = await this.props.instance.storeProductCount.call(
          i
        );
        const info = await this.props.instance.stores.call(i);

        const store = {
          id,
          ownerAddress,
          productCount,
          ...info
        };
        stores.push(store);
      }
    }

    this.setState({ stores });
  };

  render() {
    const { stores } = this.state;
    return (
      <main role="main">
        <Jumbotron
          title="Welcome"
          subtitle="This is your descentralized marketplace!"
        />
        <div className="container">
          <StoreList title="Marketplace" list={stores} web3={this.props.web3} />
        </div>
      </main>
    );
  }
}

export default Home;
