import React, { Component } from "react";
import "./menu.css";

class Menu extends Component {
  renderPlay() {
    let btnClass = this.props.on
      ? "btn btn-sm btn-danger"
      : "btn btn-sm btn-success";
    return (
      <button className={btnClass} onClick={this.props.onAutoplay}>
        {this.props.on ? "OFF" : "ON"}
      </button>
    );
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="menu">
              <h2>Autoplay Menu</h2>
              <span> Autoplay </span>
              {this.renderPlay()}
              <br></br>
              <br></br>
              <span>Gamespeed</span>
              <br></br>
              <button onClick={e => this.props.onGamespeed(-1)}>-</button>
              <span className="gamespeed">
                {"    " + this.props.gamespeed + "    "}
              </span>
              <button onClick={e => this.props.onGamespeed(1)}>+</button>
              <br></br>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
