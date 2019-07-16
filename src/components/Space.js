
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import indexBy from '../util/indexBy'
import memoizeOne from 'memoize-one'
import createSpacesDatabase from '../data/spacesDatabase'
import slug from 'slug'

import CopyToClipboard from '@adamarthurryan/react-copy-to-clipboard'

const mapStateToProps = state => 
  Object.assign(
    {cards: state.cards, spaces: state.spaces, keywords: state.keywords, posts: state.posts, tableauItems: state.tableauItems} 
  )

const mapDispatchToProps = dispatch => ({
})

class Space extends PureComponent {


    render() {
		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts, this.props.tableauItems)
		const spacesBySlug = getSpacesBySlug(database)
		const slug = this.props.match.params.spaceSlug

		const space = spacesBySlug[slug]
		
		const keywords = space
			? database.keywords.filter(keywordItem => keywordItem.space === space.space).sort((a,b) => b.vol-a.vol)
			:null

		const posts = keywords 
			? keywords.flatMap(keywordItem => (keywordItem.posts)).sort((a,b) => (a.date<b.date)-(a.date>b.date))
			: null					



        return <div>
			{space
				? <div>
					<CopyToClipboard label="Copy for Trello">
						<div style={{marginTop:"-10000px", position:"absolute"}}>
							<p>## Related Content:</p>
								{posts.map((post, index) => (
									<div key={index}> - [{post.title}]({post.publishedUrl})<br/></div>
								))}
							<p>&nbsp;</p>
							<p>## Keywords:</p>
								{keywords.map((keywordItem, index)  => (
									<div key={index}> - {keywordItem.keyword} / {keywordItem.vol} / {keywordItem.diff}<br/></div>
								))}

						</div>
					</CopyToClipboard>
						<div>
							<h3>Related Content:</h3>
							<table>
								<thead>
									<tr>
										<th></th><th></th><th>&nbsp;</th><th>Tot. Rev.</th><th>Last Rev</th><th>Tot. Pg.</th><th>Last Pg.</th>
									</tr>
								</thead>
								<tbody>
								{posts.map((post, index) => (
									<tr key={index}>
										<td><a href={post.publishedUrl} target="_blank" rel="noopener noreferrer">{post.title}</a></td>
										<td>{post.date}</td>
										<td></td>
										<td>{post.totalRevenue ? "$"+Math.floor(post.totalRevenue): ""}</td>
										<td>{post.lastMonthRevenue ? "$"+Math.floor(post.lastMonthRevenue): ""}</td>
										<td>{post.totalPageviews}</td>
										<td>{post.lastMonthPageviews}</td>
									</tr>	
								))}
								</tbody>
							</table>

							<h3>Keywords:</h3>
							<table>
								<thead>
									<tr>
										<th></th><th>Volume</th><th>Difficulty</th>
									</tr>
								</thead>
								<tbody>
								{keywords.map((keywordItem, index) => (
									<tr key={index}>
										<td>{keywordItem.keyword}</td><td>{keywordItem.vol}</td><td>{keywordItem.diff}</td>
									</tr>
								))}
								</tbody>
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

