const fs = require('fs')
const path = require('path')
const {promisify} = require('util')

const SECRET = require("./secret.js")
//const fetch = require('node-fetch')

//const apicache = require('apicache')
//let cache = apicache.middleware

//const proxy = require('express-http-proxy')
const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

const multer = require('multer')
let upload = multer()

const trelloProcess = require('./processTrelloCsv')
const tableauProcess = require('./processTableauCsv')
const tableauFilter = require('./filterTableauCsv')
const spacesProcess = require('./processSpacesCsv')
const keywordsProcess = require('./processKeywordsCsv')
const tutsPostsProcess = require('./processTutsPostsCsv')
const csvIngest = require('./csvIngest')

const SPACES_DATABASE="./data/spaces.csv"
const KEYWORDS_DATABASE="./data/keywords.csv"
const POSTS_DATABASES=["./data/cm-posts.csv", "./data/other-posts.csv"]
const TRELLO_DATABASE="./data/trello.csv"

const app = express()
const port = 8080


/*
let	posts
let	itemsByQuery
let	semrushByPost
let	semrushByQueryAndItem
*/

//let's add some basic auth
app.use(basicAuth({
	users: {[SECRET.serverUsername]: SECRET.serverPassword},
	challenge: true

}))

// for parsing application/json
app.use(bodyParser.json()); 

//return spaces
app.get('/api/spaces', async function (req, res) {
	const dataFileStream = fs.createReadStream(SPACES_DATABASE)
	const spaces = await csvIngest(dataFileStream, spacesProcess, {})
	res.send(Object.values(spaces))
	

/*	let site = req.query.site ? req.query.site : ""

	let query = `site=${site}`

	if (itemsByQuery[query])
		res.json(itemsByQuery[query])

	else {
		res.status('404')
		res.send(`No items found for query ${query}`)
	}
*/
})

//return keywords for each space
app.get('/api/keywords', async function (req, res) {
	const dataFileStream = fs.createReadStream(KEYWORDS_DATABASE)
	const keywords = await csvIngest(dataFileStream, keywordsProcess, [])
	res.send(keywords)
})

//return published posts with market alignment 
app.get('/api/posts', async function (req, res) {
	let posts = []

	await Promise.all(POSTS_DATABASES.map(async database => {
		const dataFileStream = fs.createReadStream(database)
		
		let subPosts = await csvIngest(dataFileStream, tutsPostsProcess, [])
		posts=posts.concat(subPosts)
	}))
	
	res.send(posts)	
})

//return trello board data
app.get('/api/trello', async function (req, res) {
	const dataFileStream = fs.createReadStream(TRELLO_DATABASE)
	const cards = await csvIngest(dataFileStream, trelloProcess, [])
	res.send(cards)
})

//return tableau board data
app.get('/api/trello', async function (req, res) {
	const dataFileStream = fs.createReadStream(TRELLO_DATABASE)
	const cards = await csvIngest(dataFileStream, (row)=>tableauProcess(tableauFilter(row)), [])
	res.send(cards)
})


//should have app.post for trello csv

app.post('/api/trello', upload.none(), async function (req, res) {
	const newCsv = req.body.trelloCsv
	try {
		await promisify(fs.writeFile)(TRELLO_DATABASE, newCsv)
		console.log(`Updated ${TRELLO_DATABASE}`)
		res.sendStatus(200)	
	}
	catch (ex) {
		console.log("Exception writing CSV file: ", ex)
		res.sendStatus(500)
	}
})


app.post('/api/tableau', upload.none(), async function (req, res) {
	const newCsv = req.body.tableauCsv

	//could filter new tableau CSV here instead of waiting until load

	try {
		await promisify(fs.writeFile)(TABLEAU_DATABASE, newCsv)
		console.log(`Updated ${TABLEAU_DATABASE}`)
		res.sendStatus(200)	
	}
	catch (ex) {
		console.log("Exception writing CSV file: ", ex)
		res.sendStatus(500)
	}
})

//serve the static build folder for the production version
app.use(express.static('build'));

//serve other static assets
app.get('*', function (req,res) {
  res.sendFile(path.join(__dirname, '../build/index.html'))
}) //express.static('build'))




async function launch() {
/*	posts = await loadPostsDatabase(false)
	itemsByQuery = await loadItemsDatabase()
	semrushByPost = await loadPostsSemrushDatabase()
	semrushByQueryAndItem = await loadItemsSemrushDatabase()
*/
	app.listen(port, () => console.log(`API app listening on port ${port}!`))
}

launch()tableau