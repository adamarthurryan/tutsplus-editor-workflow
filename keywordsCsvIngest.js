const Papa = require("papaparse")




module.exports = function ingestStream(stream) {
	let keywords = []
	let first = true

	function processRow (row)  {
		//Content Space
		//Keyword,Vol,Diff
	
		let space = row['space']
		let keyword = row['keyword']
		let vol = row['vol']
		let diff = row['diff']
	
		let item = {space, keyword, vol, diff}
	
		keywords.push(item)
	}		
	
	const options = {
		dynamicTyping: true,
		header: true
	}

	return new Promise( (resolve, reject) => {

		const papaStream = Papa.parse(Papa.NODE_STREAM_INPUT, options)

		papaStream.on('data', processRow)

		papaStream.on('end', () => resolve(keywords))

		stream.pipe(papaStream)
	})
}
