const Papa = require("papaparse")


module.exports = async function ingestStream(stream) {
	let spaces = {}

	let first = true

	function processRow (row)  {

		let category = row['category']
		let space = row['space']
		let approach = row['approach']
	
		let item = {category, space, approach}
	
		spaces[space] = item
	}

	const options = {
		dynamicTyping: true,
		header: true
	}

	return new Promise( (resolve, reject) => {
		const papaStream = Papa.parse(Papa.NODE_STREAM_INPUT, options)

		papaStream.on('data', processRow)

		papaStream.on('end', () => resolve(spaces))

		stream.pipe(papaStream)
	})
}

