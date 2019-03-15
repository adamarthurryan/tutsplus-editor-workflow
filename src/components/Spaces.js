
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import groupBy from 'lodash.groupBy'
import createSpacesDatabase from '../data/spacesDatabase'
import slug from 'slug'

import filterKeys from '../util/filterKeys'

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

class Spaces extends PureComponent {


    render() {
        //this is not the right place to do data processing?

		const keys={"category", "space", "approach"}
		const columns=[
			{Header: "Category", accessor:"category"},
			{Header: "Space", accessor:"space",
				Cell: (props) => <Link to={`spaces/${slug(props.value.toLowerCase())}`}>{props.value}</Link>
			},
			{Header: "Approach", accessor:"approach"}
		]

		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts)
		//const spacesByCategory=groupBy(Object.values(database.spaces), "category")
		
        return <TreeTable
			data={spaces}
			columns={columns}
			filtered
			/>
		
		/*<div>
			{Object.keys(spacesByCategory).map(category => 
				<div>
					<h2 key={category}>{category}</h2>
					<table>
					{spacesByCategory[category].map(spaceItem =>
						<tr> 
							<td key={spaceItem.space}><Link to={`spaces/${slug(spaceItem.space.toLowerCase())}`}>{spaceItem.space}</Link></td><td> {spaceItem.approach}</td>
						</tr>
						)}
					</table>
				</div> 
			)}
		</div>
    	*/
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Spaces)


const SPACES_LISTS = [
//	"README",
	"Request",
	"Pitch",
	"Assigned",
	"In Progress",
	"Ready for Review",
	"In Review",
	"In Copy Editing",
	"Scheduled"
].map(str => str.toLowerCase())


//const createRows = memoizeOne(createRowsInternal)

