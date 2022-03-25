import '!!file-loader?name=favicon.ico!../public/favicon.ico'
import '!!file-loader?name=favicon.png!../public/favicon.png'
import '!!file-loader?name=favicon-192x192.png!../public/favicon-192x192.png'
import '../styles/index.less'

import 'babel-polyfill'
import config from 'config'
import React from 'react'
import ReactDOM from 'react-dom'
// import { once } from 'lodash'
import { Provider } from 'react-redux'
// import { auth } from 'lib/firebase'
import history from 'lib/history'
// import globalEventSource from 'lib/globalEventSource'
import configureStore from './store/configureStore'
// import * as meActions from './actions/me'
import * as eventActions from './actions/event'
import App from './App'

const store = configureStore()

// Things that should happen on every location change
const onLocationChange = (location) => {
  // Keeping track of the event based on the url
  store.dispatch(eventActions.change(location))
}

// Analytics for each page and current page
history.listen(onLocationChange)
onLocationChange(history.location)

// Firebase will trigger the action if the user is logged in from a previous
// session when first loading the page. Note that this action is slightly different
// than the login action which contains the user and the twitter credentials
// This is also wrapped in once, so that it only happens for the intial load
// and everything else is handled as part of the me actions
// auth.onAuthStateChanged(
//   once((user) => store.dispatch(meActions.initialAuth(user)))
// )

// Add debugging helperts to global
if (process.env.NODE_ENV !== 'production')
  window.bc = require('lib/debug')(store)

// Start SSE handlers for things that will be used across multiple pages
// These can be called for all events because the SSE handlers will bailout
// based on if the event is live or not
// globalEventSource(store.dispatch, store.getState)

config.events.forEach((event) => {
  eventActions.countdown(event)(store.dispatch, store.getState)
})

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
)
