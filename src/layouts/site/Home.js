import React, { Component } from "react";
import AdminHome from "../../components/homes/AdminHome";
import StoreOwnerHome from "../../components/homes/StoreOwnerHome";
import ShopperHome from "../../components/homes/ShopperHome";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  render() {
    const {isAdmin, isStoreOwner} = this.props;
    return(
      <div>
        {isAdmin ? <AdminHome {...this.props} /> : null}
        {isStoreOwner ? <StoreOwnerHome {...this.props} />: null}
        {!isStoreOwner && !isAdmin ? <ShopperHome {...this.props} /> : null}
      </div>
    );
   
  }
}

export default Home;
