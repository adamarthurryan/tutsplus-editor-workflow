import memoizeOne from 'memoize-one';

import groupBy from 'lodash.groupby'

const CARD_LISTS = [
    //	"README",
        "Request",
        "Pitch",
        "Assigned",
        "In Progress",
        "Ready for Review",
        "In Review",
        "In Copy Editing",
        "Scheduled"
    ].map(str => str.toLowerCase())

const SCHEDULED_LIST = "Scheduled"

const LABEL_README = "Readme"

    
function createSpacesDatabase (cards, spaces, keywords, posts, tableau) {
	let archivedScheduledCards = processArchivedScheduledCards(cards)
	let tableauPosts = processTableauStats(tableau)

	posts = tableauPosts

    cards = processCards(cards)

	const cardsBySpaces = groupBy(cards, "space")


	//merge spaces from cards into spaces list
	Object.keys(cardsBySpaces).forEach(cardSpace => 
		! spaces.find(({space}) => space===cardSpace)  
			? spaces.push = {space:cardSpace, category:"Unknown"}
			: null 
	) 
/*
	const postsByUrl = groupBy(posts, "publishedUrl")
	
	//merge multiple redudant post entries into one
	const combinedPosts = Object.values(postsByUrl).map(posts => {
		if (posts.length == 1)
			return posts[0]
		
		else {
			let newPost = Object.assign({}, posts[0])
			newPost.auxillaryKeywords = posts.map(post => post.primaryKeyword)
			return newPost
		}

	})
	const singlePostByUrl = groupBy(combinedPosts, "publishedUrl")


	//merge info from published cards into posts list
	archivedScheduledCards.forEach(card => {
		//if this post exists in the database, add info from this card
		if (singlePostByUrl[card.publishedUrl]) {
			//create an array of updated dates
			let post = singlePostByUrl[card.publishedUrl][0]
			

			if (! post.updateDates)
				post.updateDates = post.date ? [post.date] : []
			
			
			post.updateDates.push(card.date)


			//make sure the dates are unique
			const uniqueUpdateDates = new Set(post.updateDates)
			post.updateDates = [...uniqueUpdateDates]

			//update the data of the post is the card is newer
			if (!post.date || post.date.localeCompare(card.date)<0) {
				post.title = card.title
				post.author = (card.authors && card.authors.length) ? card.authors[0] : ""
				post.primaryKeyword = card.primaryKeyword
				post.date = card.date
				post.isUpdate = card.isUpdate
				post.postType = card.postType
				post.space = card.space
			}

			//update the format
			post.postType = card.postType

			//update the keyword
			post.primaryKeyword = card.primaryKeyword
		
			singlePostByUrl[card.publishedUrl][0] = post
		}
		else {
			//otherwise, add the card to the posts list
			singlePostByUrl[card.publishedUrl] = [{
				space: card.space,
				primaryKeyword: card.primaryKeyword,
				title: card.title,
				format: card.postType, 
				date: card.date,
				author: (card.authors && card.authors.length) ? card.authors[0] : "",
				publishedUrl: card.publishedUrl,
				isUpdate: card.isUpdate
			}]
		}
	})

	posts = Object.values(posts).flat()

*/

	//merge info from published cards into posts list
	archivedScheduledCards.forEach(card => {
		if (!cmsPart(card.publishedUrl))
			return

		//if this post exists in the database, add info from this card
		if (posts[cmsPart(card.publishedUrl)]) {
			//create an array of updated dates
			let post = posts[cmsPart(card.publishedUrl)]
			

			if (! post.updateDates)
				post.updateDates = post.date ? [post.date] : []
			
			
			post.updateDates.push(card.date)


			//make sure the dates are unique
			const uniqueUpdateDates = new Set(post.updateDates)
			post.updateDates = [...uniqueUpdateDates]

			//update the data of the post if the card is newer
			if (!post.date || post.date.localeCompare(card.date)<0) {
				post.title = card.title
				post.author = (card.authors && card.authors.length) ? card.authors[0] : ""
				post.primaryKeyword = card.primaryKeyword
				post.date = card.date
				post.isUpdate = card.isUpdate
				post.postType = card.postType
				post.space = card.space
			}

			//the card knows if the post is an update
			if (card.isUpdate)
				post.isUpdate = true

			//update the format
			post.postType = card.postType

			//update the keyword
			post.primaryKeyword = card.primaryKeyword
		
			posts[cmsPart(card.publishedUrl)] = post
		}
		else {
			//otherwise, add the card to the posts list
			posts[cmsPart(card.publishedUrl)] = {
				space: card.space,
				primaryKeyword: card.primaryKeyword,
				title: card.title,
				format: card.postType, 
				date: card.date,
				author: (card.authors && card.authors.length) ? card.authors[0] : "",
				publishedUrl: card.publishedUrl,
				isUpdate: card.isUpdate
			}
		}
	})

	posts = Object.values(posts)

	//merge cards and posts into keywords list
	//each keyword can have a list of cards and posts

	//start with an empty list of cards and posts for each keyword
	keywords = keywords.map(item=>Object.assign({}, item, {cards:[], posts:[]}))
    
    //then associate each card with a keyword
	cards.forEach(card => {
		//alot of searching through the keywords list here
		//perhaps this should be optimized with a better data structure (eg. double map)
		let keywordItem = keywords.find(({space, keyword}) => space===card.space && keyword===card.primaryKeyword)
		if (keywordItem)
			keywordItem.cards.push(card)
		else
			keywords.push({space:card.space, keyword:card.primaryKeyword, cards:[card], posts:[] })
	})

	//and each post with a keyword
	posts.forEach(post => {
		let keywordItem = keywords.find(({space, keyword}) => space === post.space && keyword===post.primaryKeyword)		
		if (keywordItem)
			keywordItem.posts.push(post)
		else
			keywords.push({space:post.space, keyword:post.primaryKeyword, cards:[], posts:[post] })
	})

    return {cards, spaces, keywords, posts, tableauPosts}
}



function processArchivedScheduledCards (cards) {
    //select archived cards
    cards = cards.filter(({isArchived})=>isArchived)

	cards = cards.filter( ({list}) => list && list===SCHEDULED_LIST)

	//sort cards by date
	cards = cards.sort( (a, b) => b.date.localeCompare(a.date))

	//remove any cards with the README label
	cards = cards.filter(card => ! card.labels.includes(LABEL_README))

	return cards
} 
   

function processCards (cards) {
	cards = cards.filter( ({list}) => list && CARD_LISTS.includes(list.toLowerCase()))

	//sort cards by date (secondary) and status (primary)
	cards = cards.sort( (a, b) => 
		10000*(CARD_LISTS.indexOf(b.list.toLowerCase()) - CARD_LISTS.indexOf(a.list.toLowerCase())) 
			+ b.date.localeCompare(a.date))

	//remove any cards with the README label
	cards = cards.filter(card => ! card.labels.includes(LABEL_README))

    //remove archived cards
    cards = cards.filter(({isArchived})=>!isArchived)

	return cards
}

//process the raw tableau information into a list of posts with relevant stats 
function processTableauStats (tableau) {
	//post urls -> post data
	let posts = {}

	const newStats = item => ({publishedUrl: item.publishedUrl, title: item.title, date: item.date, space: item.space, stats: [
			{statsMonth: item.statsMonth, pageviews: item.pageviews, revenue: item.revenue}
		]})

	const mergeStats = (summary, item) => {
		summary.stats.push({statsMonth: item.statsMonth, pageviews: item.pageviews, revenue: item.revenue})
		return summary
	}

	if (tableau) {
		tableau.forEach(item => {
			if (posts[cmsPart(item.publishedUrl)])
				posts[cmsPart(item.publishedUrl)] = mergeStats(posts[cmsPart(item.publishedUrl)], item)
			else
				posts[cmsPart(item.publishedUrl)] = newStats(item)
		})
	}

	Object.keys(posts).forEach( url => 
		Object.assign(posts[url], posts[url].stats.reduce( (total, stat) => ({totalPageviews: total.totalPageviews+stat.pageviews, totalRevenue: total.totalRevenue+stat.revenue}), {totalPageviews:0, totalRevenue:0} ))
	)

	const now = new Date()
	const lastMonthString = now.getMonth() === 0
		? `${now.getFullYear()-1}-${11}-01`
		: `${now.getFullYear()}-${(now.getMonth()-1).toString().padStart(2,'0')}-01`

	Object.keys(posts).forEach( url => 
		Object.assign(posts[url], posts[url].stats.filter(stat => stat.statsMonth === lastMonthString).reduce( (total, stat) => ({lastMonthPageviews: total.lastMonthPageviews+stat.pageviews, lastMonthRevenue: total.lastMonthRevenue+stat.revenue}), {lastMonthPageviews:0, lastMonthRevenue:0} ))
	)


	return posts
}

const cmsPart = url => {

	if (! url) return null

	const search = url.match(/(cms|net)-\d+/)
	if (!search) return null

	return search[0]
}

export default memoizeOne(createSpacesDatabase)