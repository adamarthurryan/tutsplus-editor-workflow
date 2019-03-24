
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import indexBy from '../util/indexBy'
import memoizeOne from 'memoize-one'
import createSpacesDatabase from '../data/spacesDatabase'
import slug from 'slug'

import CopyToClipboard from '@adamarthurryan/react-copy-to-clipboard'

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

        return <div>
			{space
				? <div>
					<CopyToClipboard label="Copy for Trello">
						<div style={{marginTop:"-10000px", position:"absolute"}}>
							<p>## Related Content:</p>
							{keywords.map(keywordItem => (
								keywordItem.posts.map(post => (
									<div> - [{post.title}]({post.url})<br/></div>
								))
							))}
							<p>&nbsp;</p>
							<p>## Keywords:</p>
								{keywords.map(keywordItem => (
									<div> - {keywordItem.keyword} / {keywordItem.vol} / {keywordItem.diff}<br/></div>
								))}

						</div>
					</CopyToClipboard>
						<div>
							<h3>Related Content:</h3>
							<ul>
								{keywords.map(keywordItem => (
									keywordItem.posts.map(post => (
										<li><a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a></li>
									))
								))}
							</ul>
							<h3>Keywords:</h3>
							<table>
								{keywords.map(keywordItem => (
									<tr>
										<td>{keywordItem.keyword}</td><td>{keywordItem.vol}</td><td>{keywordItem.diff}</td>
									</tr>
								))}
							</table>

						</div>
				</div>
				: <h2>Not Found</h2>
			}
		</div>			
    	
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space)


const getSpacesBySlug = memoizeOne(function (database) {
	let spaces = Object.values(database.spaces).map(space => Object.assign({}, space, {slug: slug(space.space.toLowerCase())}))
	return indexBy(spaces, "slug")
})

//const createRows = memoizeOne(createRowsInternal)

