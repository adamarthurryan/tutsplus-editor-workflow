import React, { Component } from 'react';
import {connect} from 'react-redux'

import {STATE_LOADING, STATE_ERROR, STATE_DONE, STATE_EMPTY} from '../reducers'

//map the input props to this component's props
//also mix in the currently calculated q-value
const mapStateToProps = state => 
    state
  
class LoadingState extends Component {


    render() {
      const loadingStringRender = (loader) =>
        ((loader.status === STATE_LOADING || loader.status === STATE_DONE)? ` loaded` : "") 
        + ((loader.status === STATE_ERROR) ? `error` : "") 
        + ((loader.status === STATE_EMPTY) ? 'empty' : '')


    	return (
          <div className="ui section">
            <p>
                <span>Cards: {loadingStringRender(this.props.cardsLoader)}</span><span>, </span>
                <span>Posts: {loadingStringRender(this.props.postsLoader)}</span><span>, </span>
                <span>Spaces: {loadingStringRender(this.props.spacesLoader)}</span><span>, </span>
                <span>Keywords: {loadingStringRender(this.props.keywordsLoader)}</span>
            </p>
          </div>
    	)
    }
}


export default connect(mapStateToProps)(LoadingState)