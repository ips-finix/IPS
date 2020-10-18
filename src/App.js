import React, { Component } from 'react';
import ReactNotifications from 'react-notifications-component';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import { SignIn } from './components/SignIn';
import { HomePage } from './components/HomePage';
import { TagPairing } from './components/TagPairing';
import { CurrentLocation } from './components/CurrentLocation';
import { VisitHistory } from './components/VisitHistory';
import { AdminPage } from './components/AdminPage';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ReactNotifications />
          <Switch>
            <Route exact path="/" component={SignIn}></Route>
            <Route path="/home-page" component={HomePage}></Route>
            <Route path="/tag-pairing" component={TagPairing}></Route>
            <Route path="/current-location" component={CurrentLocation}></Route>
            <Route path="/visit-history" component={VisitHistory}></Route>
            <Route path="/admin-page" component={AdminPage}></Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;