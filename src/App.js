import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {pick} from 'lodash';
import {Route, Switch} from 'react-router-dom';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import countdown from 'lib/countdown';
import * as eventSelectors from './selectors/event';
import * as meSelectors from './selectors/me';
import * as bracketSelectors from './selectors/bracket';
import * as meActions from './actions/me';
import * as eventActions from './actions/event';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import routes, {getEventPath} from './routes';

const mapStateToProps = mapSelectorsToProps({
  event: eventSelectors.info,
  locks: bracketSelectors.locks,
  me: meSelectors.me,
  locked: bracketSelectors.locked
});

@connect(mapStateToProps, mapDispatchToProps({meActions, eventActions}))
export default class App extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired
  };

  // The top level App component is responsible for setting the locked status
  // of the event it is currently displaying
  componentDidMount() {
    this.startCountdown();
  }

  componentDidUpdate() {
    this.startCountdown();
  }

  componentWillUnmount() {
    this.endCountdown();
  }

  endCountdown() {
    if (this.cancelCountdown) {
      this.cancelCountdown();
    }
  }

  startCountdown() {
    const {locks, event, locked} = this.props;

    if (locked) return;

    // Start a countdown to lock the event
    this.endCountdown();
    this.cancelCountdown = countdown(locks, () => this.props.eventActions.lock(event));
  }

  render() {
    const {me, event, locked, history: {location}} = this.props;

    return (
      <div className='main-container'>
        <Header
          eventPath={getEventPath(location)}
          me={me}
          event={event}
          onLogin={this.props.meActions.login}
          onLogout={this.props.meActions.logout}
        />
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.path || '404'}
              component={route.component.prototype instanceof Component ? route.component : route.component(locked)}
              {...pick(route, 'path', 'exact', 'strict')}
            />
          ))}
        </Switch>
        <Footer event={event} locked={locked} />
      </div>
    );
  }
}
