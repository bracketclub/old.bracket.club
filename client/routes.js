'use strict';

let React = require('react');
let {Redirect, Route, NotFoundRoute} = require('react-router');

let App = require('./components/app/App');
let Subscribe = require('./pages/Subscribe');
let Results = require('./pages/Results');
let User = require('./pages/User');
let UserProfile = require('./pages/UserProfile');
let CreatedEntry = require('./pages/CreatedEntry');
let Landing = require('./pages/Landing');
let FourOhFour = require('./pages/FourOhFour');


let routes = (
    <Route name='app' path='/' handler={App}>
        <Route name='subscribe' path='subscribe' handler={Subscribe} />

        <Route name='resultsCurrent' path='results' handler={Results} />
        <Route name='results' path='results/:year?' handler={Results} />
        <Redirect from='users' to='results' />

        <Route name='userCurrent' path='users/:id' handler={User} />
        <Route name='userProfile' path='users/:id/profile' handler={UserProfile} />
        <Route name='user' path='users/:id/:year?' handler={User} />

        <Route name='entry' path=':year/:bracket' handler={CreatedEntry} />
        <Route name='landing' path=':path?' handler={Landing} ignoreScrollBehavior={true} />

        <NotFoundRoute handler={FourOhFour} />
    </Route>
);

module.exports = routes;
