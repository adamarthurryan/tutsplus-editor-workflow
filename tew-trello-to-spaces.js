const fs = require('fs')
const Papa = require("papaparse")
const trelloProcess = require('./backend/processTrelloCsv')
const spacesProcess = require('./backend/processSpacesCsv')
const keywordsProcess = require('./backend/processKeywordsCsv')
const postsProcess = require('./backend/processTutsPostsCsv')
const csvIngest = require('./backend/csvIngest')

// Ingest the exported trello board data and format it for copying to code editorial calendar

const SPACES_DATABASE="./data/spaces.csv"
const KEYWORDS_DATABASE="./data/keywords.csv"
const POSTS_DATABASE="./data/cm-posts.csv"


const collect = (collection, key, value) => collection[key] ? collection[key].push(value) : collection[key] = [value]  

const groupBy = (list, fieldName) => list.reduce( (acc,item) => {
		collect(acc, item[fieldName], item)
		return acc
	}, {} )

async function run() {
	let spaces = {}
	let keywords = []
	let posts = []

	if (fs.existsSync(SPACES_DATABASE)) {
		const dataFileStream = fs.createReadStream(SPACES_DATABASE)
		spaces = await csvIngest(dataFileStream, spacesProcess, {})
	}
	if (fs.existsSync(KEYWORDS_DATABASE)) {
		const dataFileStream = fs.createReadStream(KEYWORDS_DATABASE)
		keywords = await csvIngest(dataFileStream, keywordsProcess, [])
	}
	if (fs.existsSync(POSTS_DATABASE)) {
		const dataFileStream = fs.createReadStream(POSTS_DATABASE)
		posts = await csvIngest(dataFileStream, postsProcess, [])
	}

	let cards = await csvIngest(process.stdin, trelloProcess, [])
	cards = processCards(cards, spaces, keywords)

	const cardsBySpaces = groupBy(cards, "contentSpace")


	//merge spaces from cards into spaces list
	Object.keys(cardsBySpaces).forEach(cardSpace => !spaces[cardSpace] ? spaces[cardSpace] = {space:cardSpace, category:"Unknown"}: null ) 

	//merge cards into keywords list
	//each keyword can have a list of cards
	
	//start with an empty list of cards for each keyword
	keywords = keywords.map(item=>Object.assign({}, item, {cards:[]}))
	//then associate each card with a keyword
	cards.forEach(card => {
		//alot of searching through the keywords list here
		//perhaps this should be optimized with a better data structure (eg. double map)
		keywordItem = keywords.find(({space, keyword}) => space==card.contentSpace && keyword==card.primaryKeyword)
		if (keywordItem)
			keywordItem.cards.push(card)
		else
			keywords.push({space:card.contentSpace, keyword:card.primaryKeyword, cards:[card] })
	})

	const rows = createRows(cards, spaces, keywords, posts)

	const outputCSV = Papa.unparse(rows)
	console.log(outputCSV)
}


run()


const SPACES_LISTS = [
//	"README",
	"Request",
	"Pitch",
	"Assigned",
	"In Progress",
	"In Copy Editing",
	"Ready for Review",
	"Scheduled"
].map(str => str.toLowerCase())

const LABEL_README = "Readme"

function createRows(cards, spaces, keywords, posts) {
	//now output results
	const spacesByCategory=groupBy(Object.values(spaces), "category")
	const keywordsBySpaces=groupBy(keywords, "space")
	const postsBySpaces = groupBy(posts, "space")

	let rows = []
	Object.keys(spacesByCategory).forEach(category=> {
		rows.push(formatCategoryForSpacesDashboard(category))
		spacesByCategory[category].forEach(spaceItem => {
			rows.push(formatSpaceForSpacesDashboard(spaceItem))
			
			if (keywordsBySpaces[spaceItem.space]) {
				keywordsBySpaces[spaceItem.space].forEach(keywordItem =>{
					if (!keywordItem.cards || keywordItem.cards.length<=0) {
						rows.push(formatKeywordForSpacesDashboard(keywordItem))
					}
					else
						keywordItem.cards.forEach(card => {
							rows.push(formatKeywordForSpacesDashboard(keywordItem, card))
						})
				})
			}

			if (postsBySpaces[spaceItem.space]) {
				postsBySpaces[spaceItem.space].forEach(post => {
					rows.push(formatPostForSpacesDashboard(post))
				})
			}
		})
	})

	return rows
}

function processCards (cards, spaces, keywords) {
	cards = cards.filter( ({list}) => list && SPACES_LISTS.includes(list.toLowerCase()))

	//sort cards by date (secondary) and status (primary)
	//add placeholder dates
	//cards.map(card => Object.assign(card, {date: (! card.date || card.date == "null") ? "9999-12-31" : card.date }))
	cards = cards.sort( (a, b) => 
		10000*(SPACES_LISTS.indexOf(b.list.toLowerCase()) - SPACES_LISTS.indexOf(a.list.toLowerCase())) 
			+ b.date.localeCompare(a.date))
	//remove placeholder dates
	//cards = cards.map(card => Object.assign(card, {date: (card.date == "9999-12-31") ? "" : card.date }))

	//remove any cards with the README label
	cards = cards.filter(card => ! card.labels.includes(LABEL_README))

	return cards
}



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
function formatKeywordForSpacesDashboard(keywordItem, card=null) {
	let row = Object.assign({}, EMPTY_ROW, {"Keyword":keywordItem.keyword, "Vol":keywordItem.vol, "Diff":keywordItem.diff}) 
	if (card) {
		row = Object.assign({}, row, {"Existing":card.publishedUrl, "Title":card.title, "Date Updated":card.date, "Format":card.postType, "Progress":card.list})
		//look up the index of this list if there is a list (otherwise use -1 for an index)
		const cardListIndex = (card.list && SPACES_LISTS.includes(card.list.toLowerCase())) ? SPACES_LISTS.indexOf(card.list.toLowerCase()) : -1
		//add the trello URL only if the card is not archived and is not scheduled
		if (!card.isArchived && cardListIndex<SPACES_LISTS.indexOf("Scheduled".toLowerCase()))
			row = Object.assign({}, row, { "Trello":card.cardUrl})
	}
	return row
}
function formatPostForSpacesDashboard(post) {
	return Object.assign({}, EMPTY_ROW, {"Existing": post.url, "Title":post.title, "Date Updated":post.publication_date, "Progress":"Scheduled"})
}
