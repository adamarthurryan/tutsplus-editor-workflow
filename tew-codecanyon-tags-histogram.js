// Ingest the scraped trello board data and format it for copying to code editorial calendar.

const Papa = require("papaparse")
const fs = require("fs")


const DATABASE = 'data/codecanyon.csv'

//the entire database of items
let items = {}

//options for papa parse
const papaOptions = {
	dynamicTyping: true,
	header: true
}

function start() {
	console.log("CodeCanyon generating histogram of revenue for each tag.")
	ensureDatabaseExists()
	loadDatabase()
}

//ensure the database file exists
function ensureDatabaseExists() {
}

//stream in the database
function loadDatabase() {
	if (fs.existsSync(DATABASE)) {
		const dataFileStream = fs.createReadStream(DATABASE)
		const dataPapaStream = Papa.parse(Papa.NODE_STREAM_INPUT, papaOptions)

		dataPapaStream.on('data', (item) => items[item.id] = item )
		dataPapaStream.on('end', () => {
			console.log("Loaded "+Object.keys(items).length+ " items from the database")
			createHistogram()
		})
		dataFileStream.pipe(dataPapaStream)
	}
	else {
		console.log("Database does not exist.")
		exit(1)
	}
}

let tags = {}

//stream in the new data from STDIN
function createHistogram() {
	Object.values(items).forEach( item => {
		if (item.tags) {
			itemTags = item.tags.split(',')
		
			itemTags.forEach( tag => {
				if (!tags[tag])
					tags[tag] = {tag: tag, revenue:0, sales:0, items: 0, categories: {}}
				tags[tag].revenue += item.revenue 
				tags[tag].sales += item.sales
				tags[tag].items ++
				tags[tag].categories[item.category]=item.category
			})
		}
	})
	outputHistogram()
}

function outputHistogram() {
	
	//stringify the categories
	Object.values(tags).forEach(tag => {
		tag.categories = Object.values(tag.categories)
	})

	//sort the tags
	const orderedTags = {}
	Object.keys(tags).sort().forEach(key => orderedTags[key] = tags[key])
	

	//output them as CSV
	const csv = Papa.unparse(Object.values(orderedTags))
	console.log(csv)
}


start()