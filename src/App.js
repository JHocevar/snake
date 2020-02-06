import React, { Component } from 'react';

class App extends Component {
  state = { test: "hi" }
  render() { 
    return ( <div>
      {test}
    </div> );
  }
}
 
export default App;