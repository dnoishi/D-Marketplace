import React, { Component } from "react";
import Product from "./Product";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false
    };
  }

  render() {
    const { title, list, isOwner } = this.props;
    return (
      <div>
        <h3>{title}</h3>
        <div className="row">
          {list.map((product, i) => (
            <Product key={product.id} {...product} isOwner={isOwner}/>
          ))}
          {list.length === 0 ? <p>No products available</p> : ""}
        </div>
      </div>
    );
  }
}

export default ProductList;
