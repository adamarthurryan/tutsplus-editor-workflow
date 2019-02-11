const Papa = require("papaparse")
const trelloProcess = require('./backend/processTrelloCsv')
const csvIngest = require('./backend/csvIngest')

// Ingest the exported trello board data and format it for copying to code editorial calendar
async function run() {
	let cards = await csvIngest(process.stdin, trelloProcess, [])
	processCards(cards)
}
run()

const ED_CAL_LISTS = [
//	"README",
//	"Request",
//	"Pitch",
	"Assigned",
	"In Progress",
	"In Copy Editing",
	"Ready for Review",
	"Scheduled"
].map(str => str.toLowerCase())

const LABEL_README = "Readme"
const LABEL_PAID_IN_ADVANCE = "Paid in Advance"

function processCards (cards) {
	//only keep cards in target lists
	cards = cards.filter( ({list}) => list && ED_CAL_LISTS.includes(list.toLowerCase()))

	//remove archived cards
	cards = cards.filter( ({isArchived}) => !isArchived)

	//remove any cards with the README label
	cards = cards.filter(card => ! card.labels.includes(LABEL_README))

	//sort cards by date (secondary) and status (primary)
	//add placeholder dates
	cards.map(card => Object.assign(card, {date: (! card.date || card.date == "null") ? "9999-12-31" : card.date }))
	cards = cards.sort( (a, b) => 
		10000*(ED_CAL_LISTS.indexOf(b.list.toLowerCase()) - ED_CAL_LISTS.indexOf(a.list.toLowerCase())) 
			+ a.date.localeCompare(b.date))
	//remove placeholder dates
	cards = cards.map(card => Object.assign(card, {date: (card.date == "9999-12-31") ? "" : card.date }))
	
	const calendarLines = cards.map(card => formatForEdCal(card))
	
	const outputCSV = Papa.unparse(calendarLines)


	console.log(outputCSV)
}

function formatForEdCal({list, title, date, authors, labels, contentSpace}) {
	return {date, day:"", goal:"", title, authors:authors, rate_code:"", rate_cm:"", rate_sponsored:"", status:list, content_strategy:contentSpace, invoice:labels.includes(LABEL_PAID_IN_ADVANCE)?"Approved in Advance": ""}
}