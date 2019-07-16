const dateFormat =require('dateformat')



module.exports = function processRow (row, posts)  {
	let post = {}

	post.space = row['space']	
	post.primaryKeyword = row['primary_keyword']
	post.title = row['title']
	post.date = row['publication_date']
	post.author = row['author']
	post.publishedUrl = row['url']
	post.postType = row['format']
	post.primaryTopic = row['primary_topic']
	post.primaryCategory = row['primary_category']
	post.teaser = row['teaser']
	post.marketLinks = row['market_links']

	if (post.date && post.date != "null")
		post.date = dateFormat(Date.parse(post.date), "yyyy-mm-dd")
	else
		post.date = ""

	posts.push( post)
}


