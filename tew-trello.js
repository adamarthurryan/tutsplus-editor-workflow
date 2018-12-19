// Ingest the scraped trello board data and format it for copying to code editorial calendar.

const Papa = require("papaparse")
const dateFormat =require('dateformat')

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

	if (date && date != "null") {
		date = date + " " + (new Date()).getUTCFullYear()
		date = dateFormat(Date.parse(date), "yyyy-mm-dd")
	}

	let card = {list, title, date, authors, labels}

	cards.push(card)
}

const LISTS = ["In Progress","Ready For Review", "In Review","In Copy Editing","Scheduled For Publication"].map(str => str.toLowerCase())

function processEnd () {
	cards = cards.filter( ({list}) => LISTS.includes(list.toLowerCase()))

	//sort cards by date (secondary) and status (primary)

	cards.map(card => Object.assign(card, {date: (! card.date || card.date == "null") ? "9999-12-31" : card.date }))
	cards = cards.sort( (a, b) => 
		10000*(LISTS.indexOf(b.list.toLowerCase()) - LISTS.indexOf(a.list.toLowerCase())) 
			+ a.date.localeCompare(b.date))
//	cards = cards.sort( (a, b) => ))
	cards.map(card => Object.assign(card, {date: (card.date == "9999-12-31") ? "" : card.date }))


	const calendarLines = cards.map(card => formatForEdCal(card))
	const outputCSV = Papa.unparse(calendarLines)


	console.log(outputCSV)
}

function formatForEdCal({list, title, date, authors, labels}) {
	return {date, day:"", goal:"", title, authors:authors, rate_code:"", rate_cm:"", rate_sponsored:"", status:list, content_strategy:labels, invoice:""}
}