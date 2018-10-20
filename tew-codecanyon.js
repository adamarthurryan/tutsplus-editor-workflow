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
	console.log("CodeCanyon scraped data ingesting from STDIN.")
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
			ingestNewData()
		})
		dataFileStream.pipe(dataPapaStream)
	}
	else {
		console.log("Database does not exist.")
		ingestNewData()
	}
}

//stream in the new data from STDIN
function ingestNewData() {
	const newPapaStream = Papa.parse(Papa.NODE_STREAM_INPUT, papaOptions)
	newPapaStream.on('data', ingestRow)
	newPapaStream.on('end', outputData)

	process.stdin.pipe(newPapaStream)
}


//ingest a row of data from the input csv
//the format of this data is determined by the `scraper-scripts/codecanyon-category-all.json` script 
function ingestRow (row)  {
	
	let {title, cost, sales, author, category, tags} = row
	let url = row['title-href']
	let lastUpdated = row['lastupdated']
	let fileTypes = row['filetypes']
 
	if (title) {
	 	//remove path prefix from author name
		author = author.match(/\/user\/(.*)/)[1]

		//remove path prefix from category name
		category = category.match(/\/category\/(.*)/)[1]

		//remove label prefix from tags and split
		tags = tags.match(/Tags\:( )?([^"]*)/)[2].split(', ')

		//remove dolar sign from cost
		cost = parseInt(cost.match(/\$(.*)/)[1])

		url = url.match(/[^\?]*/)[0]
		id = url.match(/\d+$/)[0]

		//remove word "Sales" from sales and convert to number
		sales = sales.replace(" Sales", "")
		if (sales.includes("K")) {
			const parts = sales.match(/((\d+)(\.\d+)?)K/)
			
			const amount = parseFloat(parts[1])*1000 
			sales = amount
		}

		//remove label prefix from date
		lastUpdated = lastUpdated.match(/Last updated: (.*)/)[1]

		//remove html from file types and split
		fileTypes = fileTypes.replace(/<[^>]*>/g, ",").split(',').filter((x)=>x)

		const revenue = sales*cost


		const item = {id, title, cost, sales, revenue, author, category, tags, url, lastUpdated, fileTypes}
		items[id]=item
	}
}

//save the data to the database
function outputData () {
	const outputCSV = Papa.unparse(Object.values(items))
	fs.writeFile(DATABASE, outputCSV, (err) => {
		if (err) 
			console.log("Error saving data")
		else
			console.log(Object.keys(items).length+" items saved successfully.")
	})
}

start()