import React, { Component } from "react";
import Validator from 'react-forms-validator';

class AddForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      address: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.isValidationError = this.isValidationError.bind(this);
    this.flag= true;
  }
  

  handleChange = e => {
    const newAddress = e.target.value;
    this.setState({ address: newAddress });
    let { submitted } = this.state;
  };

  isValidationError(flag){
    this.setState({isFormValidationErrors:flag});
  }
    
  handleFormSubmit(event){
    event.preventDefault();
    this.setState( { submitted:true } );
    let { address, isFormValidationErrors } = this.state;
    if ( !isFormValidationErrors ){
      this.setState({ address: "" });
      this.props.submit(address);
    }
  }

  render() {
    const { address, submitted } = this.state;
    return (
      <form noValidate onSubmit={this.handleFormSubmit}>
        <div className="form-row align-items-center">
          <div className="col-md-6">
            <label className="sr-only" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              onChange={this.handleChange}
              disabled={this.props.isSubmitting}
              className="form-control"
              value={address}
              id="address"
              placeholder="Address (0x0)"
            />
            <Validator 
              isValidationError={this.isValidationError}
              isFormSubmitted={submitted} 
              reference={{address:address}} 
              validationRules={{required:true}} 
              validationMessages={{required:"This field is required",}}/>
          </div>

          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={this.props.isSubmitting}
            >
              {this.state.isSubmitting ?
                <span>
                  <i className="fa fa-spin fa-spinner"/> Sending...
                </span>
                :
                <span>Add</span>
              }
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default AddForm;
