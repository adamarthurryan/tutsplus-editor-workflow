
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import createSpacesDatabase from '../data/spacesDatabase'
import slug from 'slug'
import reactTableSubstringFilter from '../util/reactTableSubstringFilter'


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

class Posts extends PureComponent {


    render() {
        //this is not the right place to do data processing?
	//	const fields = ["space","primary_keyword","format","title","publication_date","author","url","primary_topic","primary_category","teaser","market_links"]


		const columns=[
			{Header: "Space", accessor:"space" , filterMethod: reactTableSubstringFilter
//				Cell: (props) => <Link to={`spaces/${slug(props.value.toLowerCase())}`}>{props.value}</Link>
			},
            {Header: "Title", accessor:"title", minWidth:250, filterMethod: reactTableSubstringFilter},
        	{Header: "Author", accessor:"author", filterMethod: reactTableSubstringFilter},
            {Header: "Pub Date", accessor:"publication_date"},
            {Header: "Is Update?", id:'is_update', accessor:(data => data.is_update ? "yes" :"" )}

		]

		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts)
		//const spacesByCategory=groupBy(Object.values(database.spaces), "category")
		
		console.log(database.posts)

		const sortBy = (items, key) => items.sort((a,b) => a[key] ? a[key].localeCompare(b[key]) : b[key] ? -1: 0) 

        return <TreeTable
			data={sortBy(database.posts, "space")}
			columns={columns}
			filterable
			resizable={false}
//			pivotBy={["space"]}
			/*expanded={Array.from("01234567890123456789").map(() => true)}*/
			/>
		
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts)


