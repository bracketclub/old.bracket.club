'use strict';

import React from 'react';
import {Redirect, Route, IndexRoute} from 'react-router';

import App from './components/containers/App';

import Subscribe from './pages/Subscribe';
import Results from './pages/Results';
import UserEntry from './pages/UserEntry';
import LookupEntry from './pages/LookupEntry';
import UserProfile from './pages/UserProfile';
import CreatedEntry from './pages/CreatedEntry';
import LiveOrMaster from './pages/LiveOrMaster';
import FourOhFour from './pages/FourOhFour';

export default (
  <Route path='/' component={App}>
    {/* These paths are accessible without an eventId because it defaults
        to the default from the env variables injected by webpack */}
    <IndexRoute component={LiveOrMaster} />
    <Route path='entries' component={Results} />

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
      <Route path='users/:id' component={LookupEntry} />
      {/* This is only only accessible via an event since otherwise the bracket param is ambiguous */}
      <Route path='entry/:bracket' component={CreatedEntry} />
    </Route>

    {/* 404 fallback */}
    <Route path='*' component={FourOhFour} />
  </Route>
);
