import React, { Component } from "react";
import Jumbotron from "../../components/site/Jumbotron";
import ipfs from "../../utils/ipfs";
import { Redirect } from 'react-router-dom';

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      buffer: null,
      name: "",
      description: "",
      price: "",
      quantity: "",
      toHome: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /*componentDidMount() {
    if (this.props.location.state !== null) {
      console.log(this.props.location.state.isOwner);
    }
  }*/

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    };
  };

  convertToBuffer = async reader => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer });
  };

  handleClick(e) {
    const {web3, instance, account, location} = this.props;
    e.preventDefault();
    const { id } = location.state;
    this.setState({ isSubmitting: true });
    let product = {
      name: this.state.name,
      description: this.state.description,
      image: ""
    };

    let attrHash;
    console.log('price', this.state.price);

    const weiPrice = web3.toWei(this.state.price, "ether");

    console.log('wei price', weiPrice);
    console.log('from wei', web3.fromWei(weiPrice, "ether"));

    ipfs.files
      .add(this.state.buffer)
      .then(filesAdded => {
        const file = filesAdded[0];
        product.image = "https://ipfs.io/ipfs/" + file.hash;
        const data = Buffer.from(JSON.stringify(product));
        return ipfs.files.add(data);
      })
      .then(attributesHash => {
        attrHash = attributesHash[0].hash;
        
        return instance.addProductToStore.estimateGas(
          id,
          attrHash,
          weiPrice,
          this.state.quantity,
          {
            from: account
          }
        );
      })
      .then(estimatedGas => {
        let hexHash = web3.toHex(attrHash);
        console.log('price send', weiPrice);
        return instance.addProductToStore(
          id,
          hexHash,
          weiPrice,
          this.state.quantity,
          {
            from: account,
            gas: estimatedGas + 100000
          }
        );
      })
      .then(receipt => {
        console.log(receipt.receipt);
        this.setState({
          name: "",
          description: "",
          price: "",
          quantity: ""
        });
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false, toHome: true });
      });
  }

  render() {
    const { id, storeName } = this.props.location.state;
    if (this.state.toHome === true) {
      return <Redirect to={`/store/${id}`} push/>
    }
    return (
      <div>
        <Jumbotron
          title="Add Product"
          subtitle={`Add product to ${storeName}`}
        />
        <form className="container">
          <div className="form-group col-md-6">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              id="name"
              value={this.state.name}
              onChange={this.handleChange}
              disabled={this.state.isSubmitting}
              placeholder="Enter name"
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="description">Product Description</label>
            <textarea
              className="form-control"
              name="description"
              id="description"
              rows="3"
              onChange={this.handleChange}
              value={this.state.description}
              disabled={this.state.isSubmitting}
            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="price">Product Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              id="price"
              value={this.state.price}
              onChange={this.handleChange}
              disabled={this.state.isSubmitting}
              placeholder="Enter price"
            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="quantity">Product Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              id="quantity"
              value={this.state.quantity}
              onChange={this.handleChange}
              disabled={this.state.isSubmitting}
              placeholder="Enter quantity"
            />
          </div>
          <div className="form-group col-md-6">
            <label className="sr-only" htmlFor="image">
              Store front Image
            </label>
            <input
              type="file"
              onChange={this.captureFile}
              className="form-control-file"
              id="image"
              name="image"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={this.state.isSubmitting}
            onClick={e => this.handleClick(e)}
          >
            {this.state.isSubmitting ?
              <span>
                <i className="fa fa-spin fa-spinner"/> Sending...
              </span>
              :
              <span>Add Product</span>
            }
          </button>
        </form>
      </div>
    );
  }
}

export default AddProduct;
