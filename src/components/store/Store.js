import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import storeSample from "../../images/storeSample.png";

import "./Store.css";

class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: ""
    };
  }

  componentDidMount() {
    this.loadAttributes();
  }

  loadAttributes() {
    // TODO: the only attribute we are interested to load is the image
    this.setState({ image: storeSample });
  }

  render() {
    const { id, title, description } = this.props;
    const { image } = this.state;
    return (
      <div className="col-md-4">
        <div className="card">
          <img className="card-img-top" src={image} alt="Card cap" />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <Link to={`/stores/${id}`} className="btn btn-primary">
              Go somewhere
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Store;
