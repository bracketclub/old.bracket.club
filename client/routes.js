'use strict';

const React = require('react');
const {Redirect, Route, NotFoundRoute} = require('react-router');

const App = require('./components/app/App');
const Subscribe = require('./pages/Subscribe');
const Results = require('./pages/Results');
const User = require('./pages/User');
const UserProfile = require('./pages/UserProfile');
const CreatedEntry = require('./pages/CreatedEntry');
const Landing = require('./pages/Landing');
const FourOhFour = require('./pages/FourOhFour');

const routes = (
  <Route name='app' path='/' handler={App}>
    <Route name='subscribe' path='subscribe' handler={Subscribe} />

    <Route name='resultsCurrent' path='results' handler={Results} />
    <Route name='results' path='results/:year?' handler={Results} />
    <Redirect from='users' to='results' />

    <Route name='userCurrent' path='users/:id' handler={User} />
    <Route name='userProfile' path='users/:id/profile' handler={UserProfile} />
    <Route name='user' path='users/:id/:year?' handler={User} />

    <Route name='entry' path=':year/:bracket' handler={CreatedEntry} />
    <Route name='landing' path=':path?' handler={Landing} ignoreScrollBehavior />

    <NotFoundRoute handler={FourOhFour} />
  </Route>
);

module.exports = routes;
