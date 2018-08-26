import React, { Component } from "react";
import Jumbotron from "../../components/site/Jumbotron";
import ipfs from "../../utils/ipfs";
import { Redirect } from 'react-router-dom';
import Validator from 'react-forms-validator';

class AddStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      buffer: null,
      storeName: "",
      description: "",
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
    let { storeName, description, buffer, isFormValidationErrors } = this.state;
    if ( !isFormValidationErrors ){  
      this.setState({ isSubmitting: true });
      let attributes = {
        storeName: storeName,
        description: description,
        image: ""
      };

      let attrHash;

      ipfs.files
        .add(buffer)
        .then(filesAdded => {
          const file = filesAdded[0];
          attributes.image = "https://ipfs.io/ipfs/" + file.hash;
          const data = Buffer.from(JSON.stringify(attributes));
          return ipfs.files.add(data);
        })
        .then(attributesHash => {
          console.log("ipfs", attributesHash[0].hash);
          attrHash = attributesHash[0].hash;
          return this.props.instance.addStore.estimateGas(attrHash, {
            from: this.props.account
          });
        })
        .then(estimatedGas => {
          let hexHash = this.props.web3.toHex(attrHash);
          return this.props.instance.addStore(hexHash, {
            from: this.props.account,
            gas: estimatedGas + 100000
          });
        })
        .then(receipt => {
          console.log(receipt.receipt);
          this.setState({
            storeName: "",
            description: ""
          });
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          this.setState({ isSubmitting: false,
            toHome: true });
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
    if (this.state.toHome === true) {
      return <Redirect to='/' push/>
    }
    let { storeName, description, isSubmitting, submitted } = this.state;
    return (
      <div>
        <Jumbotron title="Add Store" subtitle="Add store to the marketplace." />
        <form className="container" noValidate onSubmit={this.handleFormSubmit}>
          <div className="form-group col-md-6">
            <label htmlFor="storeName">Store Name</label>
            <input
              type="text"
              className="form-control"
              name="storeName"
              id="storeName"
              value={storeName}
              onChange={this.handleChange}
              disabled={isSubmitting}
              placeholder="Enter name"
            />
            <Validator 
              isValidationError={this.isValidationError}
              isFormSubmitted={submitted} 
              reference={{storeName:storeName}} 
              validationRules={{required:true}} 
              validationMessages={{required:"This field is required",}}/>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="description">Store Description</label>
            <textarea
              className="form-control"
              name="description"
              id="description"
              rows="3"
              onChange={this.handleChange}
              value={description}
              disabled={isSubmitting}
            />
            <Validator 
              isValidationError={this.isValidationError}
              isFormSubmitted={submitted} 
              reference={{description:description}} 
              validationRules={{required:true}} 
              validationMessages={{required:"This field is required",}}/>
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
            disabled={isSubmitting}
          >
            {this.state.isSubmitting ?
              <span>
                <i className="fa fa-spin fa-spinner"/> Sending...
              </span>
              :
              <span>Add Store</span>
            }
          </button>
        </form>
      </div>
    );
  }
}

export default AddStore;
