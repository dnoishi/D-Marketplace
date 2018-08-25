import React, { Component } from "react";
import ipfs from "../../utils/ipfs";
import { Redirect } from 'react-router-dom';

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
      toHome: false
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

  handleChange = (e) => {
    this.setState({ inputText: e.target.value });
  }

  handleModify = () => {
    this.setState({Modifiying: true});
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
        this.setState({ isSubmitting: false, toHome: true  });
      });
  }

  handleSave = (e) => {
    const newValue = this.state.inputText;
    const { instance, id, storeId, account } = this.props;
    e.preventDefault();
    this.setState({ isSubmitting: true });
    instance.changeProductPrice
      .estimateGas(storeId, id, newValue, { from: account})
      .then(estimatedGas => {
        return instance.changeProductPrice(storeId, id, newValue,{ 
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
          toHome: true  });
      });
  }

  handleBuy = e => {
    const { price, instance, id, account, web3 } = this.props;
    e.preventDefault();
    this.setState({ isSubmitting: true });
    instance.buyProduct
      .estimateGas(id, {
        from: account,
        value: price
      })
      .then(estimatedGas => {
        return instance.buyProduct(id, {
          from: account,
          gas: estimatedGas + 100000,
          value: web3.toWei(price, "ether")
        });
      })
      .then(receipt => {
        console.log(receipt.receipt);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false, toHome: true  });
      });
  };

  renderBuyButton(){
    return (
      <div class="card-body">
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
        <button onClick={ Modifiying ? this.handleSave : this.handleModify} className="btn btn-primary btn-sm">
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
    if (this.state.toHome === true) {
      return <Redirect to='/' />
    }
    const { price, quantity, isOwner } = this.props;
    const { name, description, image, Modifiying } = this.state;
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
                  <span>
                    <input className="form-control" type="number"
                      onChange={this.handleChange}
                      value={this.state.inputText} />
                  </span>
                )
                : price
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
