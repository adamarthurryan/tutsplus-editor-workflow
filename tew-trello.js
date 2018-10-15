// Ingest the scraped trello board data and format it for copying to code editorial calendar.

const Papa = require("papaparse")

const options = {
	dynamicTyping: true,
	header: true
}

const papaStream = Papa.parse(Papa.NODE_STREAM_INPUT, options)

papaStream.on('data', processRow)

papaStream.on('end', processEnd)

process.stdin.pipe(papaStream)


let cards = []

let first = true

function processRow (row)  {
	
	let list = row['list-title']
	let title = row['card-title']
	let date = row['card-date']
	let authors = row['card-author']
	let labels = row['card-labels']

	if (title)
		title = title.match(/^(\#\d+)?(.*)/)[2]

	if (authors) {
		authors = JSON.parse(authors)
		authors = authors.map(author => author['card-author-title'])
		authors = authors.map(author => author.match(/([^(]*)(\(.*\))?/)[1].trim())
	}

	if (labels) {
		labels = JSON.parse(labels)
		labels = labels.map(label => label['card-labels-title'])
	}

	let card = {list, title, date, authors, labels}
	cards.push(card)
}

const LISTS = ["In Copy Editing", "Ready For Review", "In Review", "In Progress", "Scheduled For Publication"].map(str => str.toLowerCase())

function processEnd () {
	cards = cards.filter( ({list}) => LISTS.includes(list.toLowerCase()))

	const outputCSV = Papa.unparse(cards)
	console.log(outputCSV)
}