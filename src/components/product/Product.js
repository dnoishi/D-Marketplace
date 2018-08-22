import React, { Component } from "react";
import { Link } from "react-router-dom";
import ipfs from "../../utils/ipfs";

import productSample from "../../images/productSample.png";

import "./Product.css";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      image: ""
    };
  }

  componentDidMount() {
    this.loadAttributes();
  }

  loadAttributes() {
    ipfs.files.get(this.props.metadataHash).then(r => {
      const jsonMetadata = JSON.parse(r[0].content);
      this.setState({
        name: jsonMetadata.name,
        description: jsonMetadata.description,
        image: jsonMetadata.image
      });
    });
  }

  render() {
    const { id, price, quantity } = this.props;
    const { name, description, image } = this.state;
    return (
      <div className="col-md-4">
        <div className="card">
          <img className="card-img-top" src={image} alt="Card cap" />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">
              {description}
              <br />
              {price} - {quantity}
            </p>
            <Link to={`/products/${id}`} className="btn btn-primary">
              Details
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;
