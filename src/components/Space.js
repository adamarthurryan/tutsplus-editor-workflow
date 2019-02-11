
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import * as Actions from '../actions'
import groupBy from '../util/groupBy'
import indexBy from '../util/indexBy'
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

class Space extends PureComponent {


    render() {
		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts)
		const spacesBySlug = getSpacesBySlug(database)
		const slug = this.props.match.params.spaceSlug

		const space = spacesBySlug[slug]
		
		const keywords = space
			? database.keywords.filter(keywordItem => keywordItem.space === space.space)
			:null

		console.log(keywords)

        return <CopyToClipboard>
			{space
				? <div>
					<h2>{space.space}</h2>
					<h3>Related Content:</h3>
					<ul>
						{keywords.map(keywordItem => (
							keywordItem.posts.map(post =>
								<li><a href={post.url} rel="noopener noreferrer" target="_blank">{post.title}</a></li>
							)
						))}
					</ul>
					<h3>Keywords:</h3>
					<ul>
						{keywords.map(keywordItem => (
							<li>{keywordItem.keyword} {keywordItem.vol} {keywordItem.diff}</li>
						))}
					</ul>

				</div>
				: <h2>Not Found</h2>
			}
			
		</CopyToClipboard>
    	
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space)


const getSpacesBySlug = memoizeOne(function (database) {
	let spaces = Object.values(database.spaces).map(space => Object.assign({}, space, {slug: slug(space.space.toLowerCase())}))
	return indexBy(spaces, "slug")
})

//const createRows = memoizeOne(createRowsInternal)

