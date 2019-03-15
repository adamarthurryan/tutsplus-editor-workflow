
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import * as Actions from '../actions'
import groupBy from 'lodash.groupBy'
import memoizeOne from 'memoize-one'
import createSpacesDatabase from '../data/spacesDatabase'

import CsvTable from './CsvTable'
import CopyToClipboard from '@adamarthurryan/react-copy-to-clipboard'

const mapStateToProps = state => 
  Object.assign(
    {cards: state.cards, spaces: state.spaces, keywords: state.keywords, posts: state.posts} 
  )

const mapDispatchToProps = dispatch => ({
})

class SpacesDashboard extends PureComponent {


    render() {
        //this is not the right place to do data processing?

		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts)
        let rows = createRows(database.spaces, database.keywords)

        return <CopyToClipboard>
          <CsvTable rows={rows}/>
        </CopyToClipboard>
    	
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpacesDashboard)


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


function createRowsInternal(spaces, keywords) {
	//now output results
	const spacesByCategory=groupBy(Object.values(spaces), "category")
	const keywordsBySpaces=groupBy(keywords, "space")

	console.log(spacesByCategory)

	let rows = []
	Object.keys(spacesByCategory).forEach(category=> {
		rows.push(formatCategoryForSpacesDashboard(category))
		spacesByCategory[category].forEach(spaceItem => {
			rows.push(formatSpaceForSpacesDashboard(spaceItem))
			
			if (keywordsBySpaces[spaceItem.space]) {
				keywordsBySpaces[spaceItem.space].forEach(keywordItem =>{
					if ((!keywordItem.cards || keywordItem.cards.length<=0) && (!keywordItem.posts || keywordItem.posts.length<=0)) {
						rows.push(formatKeywordForSpacesDashboard(keywordItem))
					}
					else {

						keywordItem.cards.forEach(card => {
							rows.push(formatKeywordForSpacesDashboard(keywordItem, card, null))
						})
						keywordItem.posts.forEach(post =>{
							rows.push(formatKeywordForSpacesDashboard(keywordItem, null, post))
						})
					}
				})
			}
		})
	})

	return rows
}


const createRows = memoizeOne(createRowsInternal)

/*
	Market/Elements Category, Content Space, Approach, Keyword, Vol, Diff, Existing, Content Ideas / Notes, Format, Progress
*/

const EMPTY_ROW = {"Market/Elements Category":"", "Content Space":"", "Approach":"", "Keyword":"", "Vol":"", "Diff":"", "Existing":"", "Title":"", "Date Updated":"", "Format":"", "Progress":"", "Trello":""} 
function formatCategoryForSpacesDashboard(category) {
	return Object.assign({}, EMPTY_ROW, {"Market/Elements Category": category})
}
function formatSpaceForSpacesDashboard(spaceItem) {
	return Object.assign({}, EMPTY_ROW, {"Content Space":spaceItem.space, "Approach":spaceItem.approach})
}
function formatKeywordForSpacesDashboard(keywordItem, card=null, post=null) {
	let row = Object.assign({}, EMPTY_ROW, {"Keyword":keywordItem.keyword, "Vol":keywordItem.vol, "Diff":keywordItem.diff}) 
	if (card) {
		row = Object.assign({}, row, {"Existing":card.publishedUrl, "Title":card.title, "Date Updated":card.date, "Format":card.postType, "Progress":card.list})
		//look up the index of this list if there is a list (otherwise use -1 for an index)
		const cardListIndex = (card.list && SPACES_LISTS.includes(card.list.toLowerCase())) ? SPACES_LISTS.indexOf(card.list.toLowerCase()) : -1
		//add the trello URL only if the card is not archived and is not scheduled
		if (!card.isArchived && cardListIndex<SPACES_LISTS.indexOf("Scheduled".toLowerCase()))
			row = Object.assign({}, row, { "Trello":card.cardUrl})
	}
	else if (post) {
//		console.log("post", post)
		row = Object.assign({}, row, {"Existing": post.url, "Title":post.title, "Format":post.format, "Date Updated":post.publication_date, "Progress":"Scheduled"})
	}
	return row
}

function formatPostForSpacesDashboard(post) {
	return Object.assign({}, EMPTY_ROW, {"Keyword":post.primary_keyword, "Existing": post.url, "Title":post.title, "Format":post.format, "Date Updated":post.publication_date, "Progress":"Scheduled"})
}
