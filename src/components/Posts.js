
import React, { PureComponent } from 'react'
import {Link} from 'react-router-dom'
import slug from 'slug'
import reactTableSubstringFilter from '../util/reactTableSubstringFilter'
import {connect} from 'react-redux'
import createSpacesDatabase from '../data/spacesDatabase'


import ReactTable from 'react-table'
import 'react-table/react-table.css'

const mapStateToProps = state => 
  Object.assign(
    {cards: state.cards, spaces: state.spaces, keywords: state.keywords, posts: state.posts, tableauItems: state.tableauItems} 
  )

const mapDispatchToProps = dispatch => ({
})


class Posts extends PureComponent {


    render() {

		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts, this.props.tableauItems)

		const columns=[
			{Header: "Space", accessor:"space" , minWidth: 150, filterMethod: reactTableSubstringFilter,
				Cell: (props) => props.value ? <Link to={`spaces/${slug(props.value.toLowerCase())}`}>{props.value}</Link> : ""
			},
            {Header: "Title", accessor:"title", minWidth:400, filterMethod: reactTableSubstringFilter,
        				Cell: (props) => <a target="_" href={props.original.publishedUrl}>{props.value}</a>
			},
            {Header: "Edit", accessor:"edit", minWidth:20,
        				Cell: (props) => <a target="_" href={editUrl(props.original.publishedUrl)}>→</a>
			},
        	{Header: "Author", accessor:"author", filterMethod: reactTableSubstringFilter},
        	{Header: "Format", accessor:"format", filterMethod: reactTableSubstringFilter},
            {Header: "Pub Date", accessor:"date"},
            {Header: "Is Up?", minWidth:50, id:'isUpdate', accessor:(data => data.isUpdate ? "yes" :"" )},
            {Header: "Tot. Rev.", minWidth:60, id:'totalRevenue', accessor:(data=> data.totalRevenue ? Math.floor(data.totalRevenue): "")},
            {Header: "Last Rev.", minWidth:60, id:'lastMonthRevenue', accessor:(data=> data.lastMonthRevenue ? Math.floor(data.lastMonthRevenue): "")},
            {Header: "Tot. Pg.", minWidth:60, accessor:"totalPageviews"},
            {Header: "Last Pg.", minWidth:60, accessor:"lastMonthPageviews"},
		]


		const sortBy = (items, key) => items.sort((a,b) => a[key] ? a[key].localeCompare(b[key]) : b[key] ? -1: 0) 

        return <ReactTable
			data={sortBy(database.posts, "space")}
			columns={columns}
			defaultPageSize={database.posts.length+1}
			filterable
			resizable={false}
			/*expanded={Array.from("01234567890123456789").map(() => true)}*/
			/>
		
    }
}

const editUrl = url => {

	if (! url) return null

	const search = url.match(/cms-(\d+)/)
	if (!search) return null

	return `https://tutsplus.io/tutorials/${search[1]}/edit`
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts)


