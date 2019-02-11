const Papa = require("papaparse")


module.exports = async function ingestCsv(stream, processRow, data) {
	const options = {
		dynamicTyping: true,
		header: true
	}

	return new Promise( (resolve, reject) => {
		const papaStream = Papa.parse(Papa.NODE_STREAM_INPUT, options)

		papaStream.on('data', (row) => processRow(row, data))

		papaStream.on('end', () => resolve(data))

		stream.pipe(papaStream)
	})
}

