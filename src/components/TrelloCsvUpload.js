import React, { Component } from 'react'
import {connect} from 'react-redux'
import Actions from '../actions'


//map the input props to this component's props
const mapStateToProps = state => {}

//map the relevant actions to this components props
const mapDispatchToProps = dispatch => ({
    loadTrelloCsv: csv => dispatch(Actions.loadTrelloCsv(csv)),
})

class TrelloCsvUpload extends Component {

    trelloFileChange(event) {
        const file = event.target.files[0]

        const reader = new FileReader()
        reader.onload = e => {
            this.props.loadTrelloCsv(e.target.result)
        }

        reader.readAsText(file);
    }

    render() {
      return (<div className="inline field">
        <label htmlFor="file_trello_csv" className=""> Import Trello Data</label>
        <input id="file_trello_csv" type="file" className="ui button" onChange={this.trelloFileChange.bind(this)}/>
      </div>)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TrelloCsvUpload)
    