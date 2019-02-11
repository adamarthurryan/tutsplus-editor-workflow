
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import * as Actions from '../actions'
import groupBy from '../util/groupBy'
import memoizeOne from 'memoize-one'
import createSpacesDatabase from '../data/spacesDatabase'
import slug from 'slug'

import CsvTable from './CsvTable'
import CopyToClipboard from './CopyToClipboard'

const mapStateToProps = state => 
  Object.assign(
    {cards: state.cards, spaces: state.spaces, keywords: state.keywords, posts: state.posts} 
  )

const mapDispatchToProps = dispatch => ({
})

class Spaces extends PureComponent {


    render() {
        //this is not the right place to do data processing?

		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts)
		const spacesByCategory=groupBy(Object.values(database.spaces), "category")
		
        return <div>
			{Object.keys(spacesByCategory).map(category => 
				<div>
					<h2 key={category}>{category}</h2>
					{spacesByCategory[category].map(spaceItem => 
						<p key={spaceItem.space}><Link to={`spaces/${slug(spaceItem.space.toLowerCase())}`}>{spaceItem.space}</Link>: {spaceItem.approach}</p>
					)}
				</div> 
			)}
		</div>
    	
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

