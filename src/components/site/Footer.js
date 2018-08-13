import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div>
        <footer className="footer">
          <div className="container">
            <span className="text-muted">
              D-Marketplace &#169; {new Date().getFullYear()}
            </span>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;
