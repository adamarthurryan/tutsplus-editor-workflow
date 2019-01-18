import React, { Component } from 'react'
import './App.css'

import LoadingState from './components/LoadingState'

class App extends Component {
  render() {
    return (
      <div className="ui container">
        <h1 className="ui header left floated main-header">Editor Workflow</h1>

        <div className="ui right floated right aligned segment">
          <div className="ui form ">
              <div className="fields">
                <div className="field">
                  <label>Import Trello Data</label>

                  <div className="field">
                    <button>Upload CSV...</button>
                  </div>
                </div>
              </div>

              <LoadingState/>
          </div>
        </div>

      </div>

    )
  }
}

export default App
