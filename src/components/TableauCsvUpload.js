import React, { Component } from 'react'
import {connect} from 'react-redux'
import Actions from '../actions'


//map the input props to this component's props
const mapStateToProps = state => ({})

//map the relevant actions to this components props
const mapDispatchToProps = dispatch => ({
    loadTableauCsv: csv => dispatch(Actions.loadTableauCsv(csv)),
})

class TableauCsvUpload extends Component {

    tableauFileChange(event) {
        const file = event.target.files[0]

        const reader = new FileReader()
        reader.onload = e => {
            this.props.loadTableauCsv(e.target.result)
        }

        reader.readAsText(file);
    }

    render() {
      return (<div className="inline field">
        <label htmlFor="file_tableau_csv" className=""> Import Tableau Data</label>
        <input id="file_tableau_csv" type="file" className="ui button" onChange={this.tableauFileChange.bind(this)}/>
      </div>)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TableauCsvUpload)
    