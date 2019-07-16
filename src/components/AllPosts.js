
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import createSpacesDatabase from '../data/spacesDatabase'

import Posts from './Posts'


const mapStateToProps = state => 
  Object.assign(
    {cards: state.cards, spaces: state.spaces, keywords: state.keywords, posts: state.posts, tableauItems: state.tableauItems} 
  )

const mapDispatchToProps = dispatch => ({
})

class AllPosts extends PureComponent {


    render() {
		const database = createSpacesDatabase(this.props.cards, this.props.spaces, this.props.keywords, this.props.posts, this.props.tableauItems)

		return <Posts posts={database.posts}/>
		
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPosts)


