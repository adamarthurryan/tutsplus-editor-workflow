
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import createSpacesDatabase from '../data/spacesDatabase'
import slug from 'slug'

import ReactTable from 'react-table'
import 'react-table/react-table.css'
import treeTableHOC from "react-table/lib/hoc/treeTable";

import reactTableSubstringFilter from '../util/reactTableSubstringFilter'


const TreeTable = treeTableHOC(ReactTable);


const mapStateToProps = state =>  
  Object.assign(
    {cards: state.cards, spaces: state.spaces, keywords: state.keywords, posts: state.posts, tableauItems: state.tableauItems} 
  )

const mapDispatchToProps = dispatch => ({
})

class Cards extends PureComponent {


    render() {
        //this is not the right place to do data processing?

		const columns=[
			{Header: "Space", accessor:"space" , minWidth: 150, filterMethod: reactTableSubstringFilter,
				Cell: (props) => props.value ? <Link to={`spaces/${slug(props.value.toLowerCase())}`}>{props.value}</Link> : ""
			},

            {Header: "Title", accessor:"title", minWidth:250, filterMethod: reactTableSubstringFilter},
            {Header: "Status", accessor:"list", filterMethod: reactTableSubstringFilter 
//            	Filter: (props) => ...
        	},
        	{Header: "Type", accessor:"postType", filterMethod: reactTableSubstringFilter},
        	{Header: "Author", accessor:"authors", filterMethod: reactTableSubstringFilter},
            {Header: "Due Date", accessor:"date"},
            {Header: "Is Update?", id:"isUpdate", accessor:(data => data.isUpdate ? "yes" :"" )}
		]

		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts, this.props.tableauItems)
		//const spacesByCategory=groupBy(Object.values(database.spaces), "category")
		
        return <TreeTable
			data={database.cards}
			columns={columns}
			filterable
			resizable={false}
			defaultPageSize={database.cards.length+1}
/*			pivotBy={["space"]}*/
			expanded={Array.from("01234567890123456789").map(() => true)}
			/>
		
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)


