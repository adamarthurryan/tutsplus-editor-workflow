import React, { Component } from 'react'

import './App.css'

import TrelloCsvUpload from './components/TrelloCsvUpload'
import Debug from './components/Debug'

import EditorialCalendar from './components/EditorialCalendar'
import SpacesDashboard from './components/SpacesDashboard'
import Spaces  from './components/Spaces'
import Space from './components/Space'
import Cards from './components/Cards'
import Posts from './components/Posts'

import {NavLink, Switch, Route} from 'react-router-dom'


class App extends Component {
  render() {
    return (
      <div className="ui container">
        <h1 className="ui header left floated main-header">Editor Workflow</h1>

        <div className="ui right floated right aligned segment">
          <div className="ui form ">
              <div className="fields">
                <TrelloCsvUpload/>
              </div>

              {/*<LoadingState/>*/}
          </div>

        </div>
        <div className="ui top attached secondary pointing menu">
          <NavLink className="item" activeClassName="active" to="/spaces">Spaces</NavLink>
          <NavLink className="item" activeClassName="active" to="/cards">Cards</NavLink>
          <NavLink className="item" activeClassName="active" to="/posts">Posts</NavLink>
          <NavLink className="item" activeClassName="active" to="/editorial-calendar">Editorial Calendar</NavLink>
          <NavLink className="item" activeClassName="active" to="/spaces-dashboard">Spaces Dashboard</NavLink>
        </div>

        <div className="ui bottom attached segment">
        <Switch>
            <Route path="/editorial-calendar" component={EditorialCalendar}/>
            <Route path="/spaces-dashboard" component={SpacesDashboard}/>
            <Route path="/spaces/:spaceSlug" component={Space}/>
            <Route path="/spaces" component={Spaces}/>
            <Route path="/cards" component={Cards}/>
            <Route path="/posts" component={Posts}/>
            <Route path="/debug" component={Debug}/>
        </Switch>
        </div>
      </div>

    )
  }
}

export default App
