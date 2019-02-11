const dateFormat =require('dateformat')


module.exports = function processRow (row, posts)  {
	const fields = ["space","primary_keyword","format","title","publication_date","author","url","primary_topic","primary_category","teaser","market_links"]
	let post = {}
	fields.forEach(field => post[field]=row[field])

	if (post.publication_date && post.publication_date != "null")
		post.publication_date = dateFormat(Date.parse(post.publication_date), "yyyy-mm-dd")
	else
		post.publication_date = ""

	posts.push( post)
}


