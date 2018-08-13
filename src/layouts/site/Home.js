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
    // ============== BEGIN: Function implementation here ================ //

    // TODO: We want to load the lists of stores that our contract has
    // this.state.stores expects an array of objects with these attributes:
    // {
    //   id: "store Id",
    //   idOwner: "owner address or id",
    //   title: "token attribute",
    //   description
    //   metadataHash: "store attributes",
    // }

    // Example:
    const store = {
      id: 1,
      idOwner: 1,
      title: "My Store",
      description: "My sample store in the marketplace",
      metadataHash: "METADATA"
    };
    const list = [store];
    this.setState({ stores: list });
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
          <StoreList title="Marketplace" list={stores} />
        </div>
      </main>
    );
  }
}

export default Home;
