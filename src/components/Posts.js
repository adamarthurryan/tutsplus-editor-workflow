
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

class Posts extends PureComponent {


    render() {
        //this is not the right place to do data processing?
	//	const fields = ["space","primary_keyword","format","title","publication_date","author","url","primary_topic","primary_category","teaser","market_links"]

		const columns=[
			{Header: "Space", accessor:"space"
//				Cell: (props) => <Link to={`spaces/${slug(props.value.toLowerCase())}`}>{props.value}</Link>
			},
            {Header: "Title", accessor:"title", minWidth:250},
        	{Header: "Author", accessor:"author"},
            {Header: "Pub Date", accessor:"publication_date"},
		]

		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts)
		//const spacesByCategory=groupBy(Object.values(database.spaces), "category")
		
		console.log(database.posts)

        return <TreeTable
			data={database.posts}
			columns={columns}
			filterable
			resizable={false}
			pivotBy={["space"]}
			expanded={Array.from("01234567890123456789").map(() => true)}
			/>
		
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts)


