import React, { Component } from "react";
import ipfs from "../../utils/ipfs";
import { Redirect } from 'react-router-dom';
import Validator from 'react-forms-validator';

import "./Product.css";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      image: "",
      isSubmitting: false,
      Modifiying: false,
      inputText: '',
      toStore: false,
      isFormValidationErrors : true,
      submitted:false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.isValidationError = this.isValidationError.bind(this);
    this.flag= true;
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

  handleChange = (e) => {
    this.setState({ inputText: e.target.value });
    let { submitted } = this.state;
  }

  handleModify = () => {
    this.setState({Modifiying: true});
  }

  isValidationError(flag){
    this.setState({isFormValidationErrors:flag});
  }
    
  handleFormSubmit(event){
    event.preventDefault();
    this.setState( { submitted:true } );
    let { inputText, isFormValidationErrors } = this.state;
    if ( !isFormValidationErrors ){
      const { instance, id, storeId, account, web3 } = this.props;
      let newPriceWei = web3.toWei(inputText, "ether");
      this.setState({ isSubmitting: true });
      instance.changeProductPrice
        .estimateGas(storeId, id, newPriceWei, { from: account})
        .then(estimatedGas => {
          return instance.changeProductPrice(storeId, id, newPriceWei,{ 
            from: account,
            gas: estimatedGas + 100000
          });
        })
        .then(receipt => {
          console.log(receipt.receipt);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ isSubmitting: false, Modifiying: false,
            toStore: true  });
        });
    }
  }

  handleRemove = (e) => {
    e.preventDefault();
    const { instance, id, storeId, account } = this.props;
    this.setState({ isSubmitting: true });
    instance.removeProductFromStore
      .estimateGas(storeId, id, { from: account})
      .then(estimatedGas => {
        return instance.removeProductFromStore(storeId, id, { 
          from: account,
          gas: estimatedGas + 100000
        });
      })
      .then(receipt => {
        console.log(receipt.receipt);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false, toStore: true  });
      });
  }

  handleBuy = e => {
    const { price, instance, id, account } = this.props;
    e.preventDefault();
    this.setState({ isSubmitting: true });
    instance.buyProduct.estimateGas(id, {
        from: account,
        value: price
      })
      .then(estimatedGas => {
        return instance.buyProduct(id, {
          from: account,
          gas: estimatedGas + 100000,
          value: price
        });
      })
      .then(receipt => {
        console.log(receipt);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false, toStore: true  });
      });
  };

  renderBuyButton(){
    return (
      <div className="card-body">
        <button disabled={this.state.isSubmitting} onClick={this.handleBuy} className="btn btn-primary">
          Buy
        </button>
      </div>
    );
  }

  renderOwnerButtons(){
    const {Modifiying} = this.state;
    return(
      <div className="card-body">
      <div className="btn-group" role="group" aria-label="Basic example">
        <button onClick={ Modifiying ? this.handleFormSubmit : this.handleModify} noValidate className="btn btn-primary btn-sm">
          {Modifiying 
            ? 
            this.state.isSubmitting 
              ?
              <span>
                <i className="fa fa-spin fa-spinner"/> Sending...
              </span>
              :
              <span>Save</span>
            : <span>Modify Price</span> }
        </button>
        <button disabled={this.state.isSubmitting} onClick={this.handleRemove} className="btn btn-danger btn-sm">
            {this.state.isSubmitting ?
              <span>
                <i className="fa fa-spin fa-spinner"/> Sending...
              </span>
              :
              <span>Remove Product</span>
            }
        </button>
        </div>
      </div>
    );
  }

  render() {
    const { price, quantity, isOwner, web3 } = this.props;
    if (this.state.toStore === true) {
      return <Redirect to={`/`}/>
    }
    
    const { name, description, image, Modifiying, isSubmitting, submitted, inputText  } = this.state;
    return (
      <div className="col-md-4">
        <div className="card">
          <img className="card-img-top" src={image} alt="Card cap" />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">
              {description}
              <br />
              Price:  
                { Modifiying
                  ? (
                    <span noValidate>
                      <input className="form-control" type="number"
                        onChange={this.handleChange}
                        disabled={isSubmitting}
                        value={inputText} />
                      <Validator 
                        isValidationError={this.isValidationError}
                        isFormSubmitted={submitted} 
                        reference={{inputText:inputText}}
                        validationRules={{required:true,number:true,maxLength:10}} 
                        validationMessages={{required:"This field is required",number:"Not a valid number",maxLength:"Not a valid number"}}/>
                    </span>
                  )
                  : web3.fromWei(price, 'ether')
                }
               
              <br/>
              Avaliable quantity: {quantity}
            </p>
          </div>
          { isOwner ? this.renderOwnerButtons() : this.renderBuyButton()}
        </div>
      </div>
    );
  }
}

export default Product;
