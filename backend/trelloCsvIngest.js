const Papa = require("papaparse")
const dateFormat =require('dateformat')



module.exports = async function ingestStream(stream) {

	let cards = []
	let first = true

	const options = {
        dynamicTyping: true,
        header: true
    }

	function processRow (row)  {
	
		let cardUrl = row['Card URL']
	
		let list = row['List Name']
		let title = row['Card Name']
		let date = row['Due Date']
		let authors = row['Members']
		let labels = row['Labels']
	
		let isArchived = row['Archived']
	
		let publishedUrl = row['Published URL']
		let cmsUrl = row['CMS URL']
		let contentSpace = row['Content Space']	
		let primaryKeyword = row['Primary Keyword']
		let postType = row['Type']
		let isUpdate = row['Update?']
	
		if (authors) 
			authors = authors.split(',')
		else
			authors = []
	
		if (labels) {
			//split labels and remove color tag
			labels = labels.split(',')
			labels = labels.map(label => label.replace(/\([^)]*\)/, "").trim())
		}
		else
			labels = []
	
		if (date && date != "null")
			date = dateFormat(Date.parse(date), "yyyy-mm-dd")
		else
			date = ""
	
		let card = {cardUrl, list, title, date, authors, labels, isArchived, cmsUrl, publishedUrl, contentSpace, primaryKeyword, postType, isUpdate}
	
		cards.push(card)
	}

	return new Promise( (resolve, reject) => {
		const papaStream = Papa.parse(Papa.NODE_STREAM_INPUT, options)

		papaStream.on('data', processRow)

		papaStream.on('end', () => resolve(cards))

		stream.pipe(papaStream)
	})
}

