import React, { Component } from "react";

class AddForm extends Component {
  state = {
    address: ""
  };

  handleChange = e => {
    const newAddress = e.target.value;
    this.setState({ address: newAddress });
  };

  handleOnClick = e => {
    e.preventDefault();
    this.props.submit(this.state.address);
    this.setState({ address: "" });
  };

  render() {
    const { address } = this.state;
    return (
      <form>
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
          </div>

          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={this.props.isSubmitting}
              onClick={this.handleOnClick}
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
