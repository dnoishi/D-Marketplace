import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import getWeb3 from "./utils/getWeb3";

getWeb3
  .then(results => {
    ReactDOM.render(
      <App web3={results.web3} />,
      document.getElementById("root")
    );
  })
  .catch(e => {
    console.log(e);
    console.log("Error finding web3.");
  });
