import React, { Component } from "react";
import Jumbotron from "../../components/site/Jumbotron";

class AddStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      storeFrontImg: null,
      name: "",
      description: ""
    };
  }

  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async reader => {
    //file is converted to a buffer for upload to IPFS
    const storeFrontImg = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ storeFrontImg });
  };

  render() {
    return (
      <div>
        <Jumbotron title="Add Store" subtitle="Add store to the marketplace." />
        <form className="container">
            <div class="form-row">
                <div className="form-group col-md-6">
                    <label for="name">Store Name</label>
                    <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter name"
                    />
                </div>
                <div className="form-group col-md-6">
                    <label for="description">Store Description</label>
                    <textarea className="form-control" id="description" rows="3" />
                </div>
                <div className="form-group col-md-6">
                    <label for="storeFrontImg">Store front Image</label>
                    <input
                    type="file"
                    className="form-control-file"
                    id="storeFrontImg"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </div>
        </form>
      </div>
    );
  }
}

export default AddStore;
