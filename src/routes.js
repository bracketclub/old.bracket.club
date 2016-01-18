'use strict';

import React from 'react';
import {Redirect, Route, IndexRoute} from 'react-router';

import App from './components/containers/App';

import Subscribe from './pages/Subscribe';
import Results from './pages/Results';
import UserEntry from './pages/UserEntry';
import UserProfile from './pages/UserProfile';
import CreatedEntry from './pages/CreatedEntry';
import LiveOrMaster from './pages/LiveOrMaster';
import FourOhFour from './pages/FourOhFour';

// TODO: analytics
// import {pageview} from './lib/analytics';

export default (
  <Route path='/' component={App}>
    {/* These paths are accessible without an eventId because it defaults
        to the default from the env variables injected by webpack */}
    <IndexRoute component={LiveOrMaster} />
    <Route path='entries' component={Results} />

    {/* A result id is unique so this will work, but the eventId prefix is preferred */}
    <Route path='entries/:id' component={UserEntry} />

    {/* Redirect for past tweeted entries, the event is now always first */}
    <Redirect from='entry/:eventId/:bracket' to=':eventId/entry/:bracket' />

    {/* Redirect to entries since thats similar and there is no list of users */}
    <Redirect from='users' to='entries' />
    <Route path='users/:id' component={UserProfile} />

    {/* Static pages */}
    <Route path='subscribe' component={Subscribe} />

    {/* This needs to come last since the eventId is a param */}
    <Route path=':eventId'>
      <IndexRoute component={LiveOrMaster} />
      <Route path='entries' component={Results} />
      <Route path='entries/:id' component={UserEntry} />
      {/* This is only only accessible via an event since otherwise the bracket param is ambiguous */}
      <Route path='entry/:bracket' component={CreatedEntry} />
    </Route>

    {/* 404 fallback */}
    <Route path='*' component={FourOhFour} />
  </Route>
);
