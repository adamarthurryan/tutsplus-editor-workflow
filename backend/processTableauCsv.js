const dateFormat =require('dateformat')



module.exports = function processRow (row, tableau)  {
	let title = row['Title']
	let space = row['Content Space']
	let publishedUrl = row['Url'] 
	let statsMonth = row['Month Start']
	let pageviews = row['Pageviews']
	let revenue = row['Revenue']
	let date = row['Published At']
	let author = row['author_name']

	if (date && date !== "null")
		date = dateFormat(Date.parse(date), "yyyy-mm-dd")
	else
		date = ""

	if (statsMonth && statsMonth !== "null")
		statsMonth = dateFormat(Date.parse(statsMonth), "yyyy-mm-dd")
	else
		statsMonth = ""

	if (revenue) {
		revenue = Number(revenue.replace(/[^0-9.-]+/g,""));
		if (isNaN(revenue))
			revenue = 0
	}
	else
		revenue = 0





	let tableauItem = {title, author, space, publishedUrl, statsMonth, pageviews, revenue, date}

	tableau.push(tableauItem)
}
/*
	const fields = ["space","primary_keyword","format","title","publication_date","author","url","primary_topic","primary_category","teaser","market_links"]
	let post = {}
	fields.forEach(field => post[field]=row[field])

	if (post.publication_date && post.publication_date != "null")
		post.publication_date = dateFormat(Date.parse(post.publication_date), "yyyy-mm-dd")
	else
		post.publication_date = ""

	posts.push( post)
*/



