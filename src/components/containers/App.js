import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {last} from 'lodash';

import countdown from '../../lib/countdown';
import eventSelector from '../../selectors/event';
import * as bracketSelectors from '../../selectors/bracket';
import * as entriesSelectors from '../../selectors/entries';
import * as meActionCreators from '../../actions/me';

import Header from '../app/Header';
import Footer from '../app/Footer';

const mapStateToProps = (state) => ({
  event: eventSelector(state),
  lock: bracketSelectors.lock(state),
  userId: entriesSelectors.currentUserId(state),
  me: state.me
});

const mapDispatchToProps = (dispatch) => ({
  meActions: bindActionCreators(meActionCreators, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    meActions: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    lock: PropTypes.object.isRequired,
    routes: PropTypes.array,
    userId: PropTypes.string,
    params: PropTypes.object
  };

  // The top level App component is responsible for setting the locked status
  // of the event it is currently displaying
  componentDidMount() {
    this.startCountdown(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.startCountdown(nextProps);
  }

  componentWillUnmount() {
    this.cancelCountdown();
  }

  startCountdown({lock}) {
    if (!lock.isLocked()) {
      if (this.cancelCountdown) {
        this.cancelCountdown();
      }
      this.cancelCountdown = countdown(lock.timeLeft, () => this.forceUpdate());
    }
  }

  render() {
    const {me, event, children, meActions, routes, userId, params} = this.props;
    const {getEventPath} = (last(routes) || {}).component;
    const eventPathParams = {...params, userId};

    return (
      <div className='main-container'>
        <Header
          eventPath={getEventPath ? (e) => getEventPath(e, eventPathParams) : null}
          me={me}
          event={event}
          onLogin={meActions.login}
          onLogout={meActions.logout}
        />
        {children}
        <Footer />
      </div>
    );
  }
}
