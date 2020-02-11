import React, { Component } from "react";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.css";

class Navbar extends Component {
  render() {
    return (
      <div className="row" id="navbar">
        <div className="col-4 align-self-center">
          <button className="btn btn-primary" onClick={this.props.onGenerate}>
            {" "}
            Generate Ham Cycle{" "}
          </button>
        </div>
        <div className="col-4">
          <h1>Snake!</h1>
        </div>
        <div className="col-1 align-self-center">
          <button className="btn btn-primary" onClick={this.props.onReset}>
            Reset
          </button>
        </div>
        <div className="col-5"></div>
      </div>
    );
  }
}

export default Navbar;
