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
    {/* The landing page is accessible without an eventId because it defaults
        to the active event from the env variables injected by webpack */}
    <IndexRoute component={LiveOrMaster} />

    {/* Redirect for past tweeted entries, the event is now always first */}
    <Redirect from='entry/:eventId/:bracket' to=':eventId/entry/:bracket' />

    {/* A user profile page doesnt need to live at an event url */}
    <Route path='users/:id' component={UserProfile} />

    {/* Static pages */}
    <Route path='subscribe' component={Subscribe} />

    {/* This needs to come last since the eventId is a param */}
    <Route path=':eventId'>
      <IndexRoute component={LiveOrMaster} />
      <Route path='entries' component={Results} />
      <Route path='entries/:id' component={UserEntry} />
      <Route path='users/:id' component={LookupEntry} />
      {/* These are the links the get posted to twitter */}
      <Route path='entry/:bracket' component={CreatedEntry} />
      {/* This is the fallback so that the url looks the same as the bracket during entry */}
      <Route path=':bracket' component={LiveOrMaster} />
    </Route>

    {/* 404 fallback */}
    <Route path='*' component={FourOhFour} />
  </Route>
);
