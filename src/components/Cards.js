
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import createSpacesDatabase from '../data/spacesDatabase'
import slug from 'slug'

import ReactTable from 'react-table'
import 'react-table/react-table.css'
import treeTableHOC from "react-table/lib/hoc/treeTable";

const TreeTable = treeTableHOC(ReactTable);


const mapStateToProps = state => 
  Object.assign(
    {cards: state.cards, spaces: state.spaces, keywords: state.keywords, posts: state.posts} 
  )

const mapDispatchToProps = dispatch => ({
})

class Cards extends PureComponent {


    render() {
        //this is not the right place to do data processing?

		const columns=[
			{Header: "Space", accessor:"contentSpace"
//				Cell: (props) => <Link to={`spaces/${slug(props.value.toLowerCase())}`}>{props.value}</Link>
			},
            {Header: "Title", accessor:"title", minWidth:250},
            {Header: "Status", accessor:"list", 
//            	Filter: (props) => ...
        	},
        	{Header: "Type", accessor:"postType"},
        	{Header: "Author", accessor:"authors"},
            {Header: "Due Date", accessor:"date"},
            {Header: "Is Update?", accessor:"isUpdate"}
		]

		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts)
		//const spacesByCategory=groupBy(Object.values(database.spaces), "category")
		
        return <TreeTable
			data={database.cards}
			columns={columns}
			filterable
			resizable={false}
			pivotBy={["contentSpace"]}
			expanded={Array.from("01234567890123456789").map(() => true)}
			/>
		
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)


