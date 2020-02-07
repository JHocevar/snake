import React, { Component } from "react";
import "./Gamebox.css";

class Gamebox extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3 gamebox"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Gamebox;
