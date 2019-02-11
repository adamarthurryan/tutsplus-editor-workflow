
import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as Actions from '../actions'

import CopyToClipboard from './CopyToClipboard'

const mapStateToProps = state => 
  Object.assign(
    state
  )

const mapDispatchToProps = dispatch => ({
})

class Debug extends Component {

    render() {
      return <CopyToClipboard>
        <table className="ui left aligned table" ref={this.tableRef}>
          <thead>
            <tr><th>Title</th><th>List</th><th>Content Space</th><th>Due Date</th></tr>
          </thead>
          <tbody>
            {this.props.cards.map(card=> (
              <tr>
                <td>{card.title}</td>
                <td>{card.list}</td>
                <td>{card.contentSpace}</td>
                <td>{card.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CopyToClipboard>
    	
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Debug)