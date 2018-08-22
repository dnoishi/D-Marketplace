import React, { Component } from "react";
import Jumbotron from "../../components/site/Jumbotron";
import ipfs from "../../utils/ipfs";

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      buffer: null,
      name: "",
      description: "",
      price: "",
      quantity: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state !== null) {
      console.log(this.props.location.state.isOwner);
    }
  }

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
    e.preventDefault();
    const { id } = this.props.location.state;
    this.setState({ isSubmitting: true });
    let product = {
      name: this.state.name,
      description: this.state.description,
      image: "",
      attributes: {
        price: this.state.price,
        quantity: this.state.quantity
      }
    };

    let attrHash;

    ipfs.files
      .add(this.state.buffer)
      .then(filesAdded => {
        const file = filesAdded[0];
        product.image = "https://ipfs.io/ipfs/" + file.hash;
        const data = Buffer.from(JSON.stringify(product));
        return ipfs.files.add(data);
      })
      .then(attributesHash => {
        console.log("ipfs", attributesHash[0].hash);
        attrHash = attributesHash[0].hash;
        return this.props.instance.addProductToStore.estimateGas(
          id,
          attrHash,
          this.state.price,
          this.state.quantity,
          {
            from: this.props.account
          }
        );
      })
      .then(estimatedGas => {
        let hexHash = this.props.web3.toHex(attrHash);
        return this.props.instance.addProductToStore(
          id,
          hexHash,
          this.state.price,
          this.state.quantity,
          {
            from: this.props.account,
            gas: estimatedGas + 1000
          }
        );
      })
      .then(receipt => {
        console.log(receipt);
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
        this.setState({ isSubmitting: false });
      });
  }

  render() {
    const { storeName } = this.props.location.state;
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
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="price">Product Price</label>
            <input
              type="text"
              className="form-control"
              name="price"
              id="price"
              value={this.state.price}
              onChange={this.handleChange}
              placeholder="Enter price"
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="quantity">Product Quantity</label>
            <input
              type="text"
              className="form-control"
              name="quantity"
              id="quantity"
              value={this.state.quantity}
              onChange={this.handleChange}
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
            Add Product
          </button>
        </form>
      </div>
    );
  }
}

export default AddProduct;
