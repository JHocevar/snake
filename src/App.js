import React, { Component } from "react";
import "./App.css";
import Gamebox from "./components/Gamebox";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  state = { test: "hi" };
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-4"> Col 1</div>
          <div className="col-4"> Col 2</div>
          <div className="col-4"> Col 3</div>
        </div>
        <div className="row">
          <div className="col-1"> Col 1</div>
          <div className="col-10">
            <Gamebox />
            {/* Col 10 */}
          </div>
          <div className="col-1"> Col 1</div>
        </div>
      </div>
    );
  }
}

export default App;
