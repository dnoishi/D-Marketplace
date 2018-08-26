import React, { Component } from "react";
import Jumbotron from "../../components/site/Jumbotron";
import ipfs from "../../utils/ipfs";
import { Redirect } from 'react-router-dom';
import Validator from 'react-forms-validator';

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
      toHome: false,
      isFormValidationErrors : true,
      submitted:false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.isValidationError = this.isValidationError.bind(this);
    this.flag= true;
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
    let { submitted } = this.state;
  }

  isValidationError(flag){
    this.setState({isFormValidationErrors:flag});
  }

  handleFormSubmit(event){
    event.preventDefault();
    this.setState( { submitted:true } );
    let { name, description, price, quantity, isFormValidationErrors } = this.state;
    if ( !isFormValidationErrors ){
        const {web3, instance, account, location} = this.props;
        const { id } = location.state;
        this.setState({ isSubmitting: true });
        let product = {
          name: name,
          description: description,
          image: ""
        };

        let attrHash;
        const weiPrice = web3.toWei(price, "ether");

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
              quantity,
              {
                from: account
              }
            );
          })
          .then(estimatedGas => {
            let hexHash = web3.toHex(attrHash);
            return instance.addProductToStore(
              id,
              hexHash,
              weiPrice,
              quantity,
              {
                from: account,
                gas: estimatedGas + 100000
              }
            );
          })
          .then(receipt => {
            alert(receipt.logs[0].event);
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

  render() {
    const { id, storeName } = this.props.location.state;
    if (this.state.toHome === true) {
      return <Redirect to={`/store/${id}`} push/>
    }
    let { name, description, price, quantity, submitted } = this.state;
    return (
      <div>
        <Jumbotron
          title="Add Product"
          subtitle={`Add product to ${storeName}`}
        />
        <form className="container" noValidate onSubmit={this.handleFormSubmit}>
          <div className="form-group col-md-6">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              id="name"
              value={name}
              onChange={this.handleChange}
              disabled={this.state.isSubmitting}
              placeholder="Enter name"
            />
            <Validator 
              isValidationError={this.isValidationError}
              isFormSubmitted={submitted} 
              reference={{name:name}} 
              validationRules={{required:true}} 
              validationMessages={{required:"This field is required",}}/>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="description">Product Description</label>
            <textarea
              className="form-control"
              name="description"
              id="description"
              rows="3"
              onChange={this.handleChange}
              value={description}
              disabled={this.state.isSubmitting}
            />
            <Validator 
              isValidationError={this.isValidationError}
              isFormSubmitted={submitted} 
              reference={{description:description}} 
              validationRules={{required:true}} 
              validationMessages={{required:"This field is required",}}/>
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="price">Product Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              id="price"
              value={price}
              onChange={this.handleChange}
              disabled={this.state.isSubmitting}
              placeholder="Enter price"
            />
            <Validator 
              isValidationError={this.isValidationError}
              isFormSubmitted={submitted} 
              reference={{price:price}}
              validationRules={{required:true,number:true,maxLength:10}} 
              validationMessages={{required:"This field is required",number:"Not a valid number",maxLength:"Not a valid number"}}/>
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="quantity">Product Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              id="quantity"
              value={quantity}
              onChange={this.handleChange}
              disabled={this.state.isSubmitting}
              placeholder="Enter quantity"
            />
            <Validator 
              isValidationError={this.isValidationError}
              isFormSubmitted={submitted} 
              reference={{quantity:quantity}}
              validationRules={{required:true,number:true,maxLength:10}} 
              validationMessages={{required:"This field is required",number:"Not a valid number",maxLength:"Not a valid number"}}/>
          </div>
          <div className="form-group col-md-6">
            <label className="sr-only" htmlFor="image">
              Product Image
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
