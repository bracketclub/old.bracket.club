'use strict';

const React = require('react');
const {Redirect, Route, IndexRoute} = require('react-router');

const App = require('./components/app/App');
const Subscribe = require('./pages/Subscribe');
const Results = require('./pages/Results');
const User = require('./pages/User');
const UserProfile = require('./pages/UserProfile');
const CreatedEntry = require('./pages/CreatedEntry');
const Landing = require('./pages/Landing');
const FourOhFour = require('./pages/FourOhFour');

//     <Redirect from='users' to='results' />

const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Landing} />

    <Route path='subscribe' component={Subscribe} />

    <Route path='results'>
      <IndexRoute component={Results} />
      <Route path=':year' component={Results} />
    </Route>

    <Redirect from='users' to='results' />

    <Route path='users'>
      <Route path=':id' component={User} />
      <Route path=':id/profile' component={UserProfile} />
      <Route path=':id/:year' component={User} />
    </Route>

    <Route path=':year/:bracket' component={CreatedEntry} />

    <Route path='*' component={FourOhFour} />
  </Route>
);

module.exports = routes;
