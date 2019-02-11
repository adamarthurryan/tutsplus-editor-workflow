
module.exports = function processRow (row, spaces)  {
	let category = row['category'] 
	let space = row['space']
	let approach = row['approach']

	let item = {category, space, approach}

	spaces[space] = item
}

