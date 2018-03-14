import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {pick} from 'lodash';
import {Route, Switch, Router} from 'react-router-dom';
import RouteChanger from 'lib/routeChanger';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import * as bracketSelectors from './selectors/bracket';
import * as eventActions from './actions/event';
import routes from './routes';

const mapStateToProps = mapSelectorsToProps({
  locked: bracketSelectors.locked
});

@connect(mapStateToProps, mapDispatchToProps({eventActions}))
export default class App extends Component {
  static propTypes = {
    locked: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    eventActions: PropTypes.object.isRequired
  };

  render() {
    const {locked, history} = this.props;

    return (
      <Router history={history}>
        <RouteChanger history={history} onChange={this.props.eventActions.change}>
          <Switch>
            {routes.map((route) => (
              <Route
                key={route.path || '404'}
                component={route.component.prototype instanceof Component ? route.component : route.component(locked)}
                {...pick(route, 'path', 'exact', 'strict')}
              />
            ))}
          </Switch>
        </RouteChanger>
      </Router>
    );
  }
}
