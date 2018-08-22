import React, { Component } from "react";
import Store from "./Store";

class StoreList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false
    };
  }
  render() {
    const { title, list } = this.props;
    return (
      <div>
        <h3>{title}</h3>
        <div className="row">
          {list.map((store, i) => (
            <Store
              key={store.id}
              {...store}
            />
          ))}
          {list.length === 0 ? <p>No stores available</p> : ""}
        </div>
      </div>
    );
  }
}

export default StoreList;
