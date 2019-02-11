
module.exports = function processRow (row, keywords)  {
	//Content Space
	//Keyword,Vol,Diff

	let space = row['space']
	let keyword = row['keyword']
	let vol = row['vol']
	let diff = row['diff']

	let item = {space, keyword, vol, diff}

	keywords.push(item)
}		
	