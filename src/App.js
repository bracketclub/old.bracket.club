import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { pick } from 'lodash'
import { Route, Switch, Router } from 'react-router-dom'
import mapSelectorsToProps from 'lib/mapSelectorsToProps'
import * as bracketSelectors from './selectors/bracket'
import routes from './routes'

const mapStateToProps = mapSelectorsToProps({
  locked: bracketSelectors.locked,
})

@connect(mapStateToProps)
export default class App extends Component {
  static propTypes = {
    locked: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
  }

  render() {
    const { locked, history } = this.props

    return (
      <Router history={history}>
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.path || '404'}
              component={
                route.component.prototype instanceof Component
                  ? route.component
                  : route.component(locked)
              }
              {...pick(route, 'path', 'exact', 'strict')}
            />
          ))}
        </Switch>
      </Router>
    )
  }
}
