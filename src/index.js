import React from 'react';
import {Component} from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter } from "react-router-dom";

import * as Redux from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import {connect} from 'react-redux'

import * as reducers from './reducers'
import * as localStore from './util/localStore'

//create the redux store
//initial state is retrieved from localStore
const store = Redux.createStore(
    Redux.combineReducers(reducers), 
    localStore.get(),
    Redux.compose(Redux.applyMiddleware(
        thunkMiddleware,
    ))
  )

  //save the state whenever the state changes
function saveState() {
    let state = store.getState()
    localStore.set(state, [])
}
store.subscribe(saveState)
  

//create a root component and give it access to state and actions
const mapStateToProps = (state) => ({
})
const mapDispatchToProps = (dispatch) => ({
})

class Root extends Component {
  componentWillMount() {
  }

  render() {
    return <BrowserRouter><App/></BrowserRouter>
  }
}
Root = connect(mapStateToProps, mapDispatchToProps)(Root)

ReactDOM.render(
      <Provider store={store}>
        <Root/>
      </Provider>
  , 
  document.getElementById('root')
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
