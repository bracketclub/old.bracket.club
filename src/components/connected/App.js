import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {last} from 'lodash';

import countdown from '../../lib/countdown';
import eventInfo from '../../selectors/event';
import * as bracketSelectors from '../../selectors/bracket';
import * as meActionCreators from '../../actions/me';
import * as eventActionCreators from '../../actions/event';

import Header from '../layout/Header';
import Footer from '../layout/Footer';

const mapStateToProps = (state, props) => {
  const event = eventInfo(state, props);
  const locked = (state.event[event.id] || {}).locked;
  const locks = bracketSelectors.locks(state, props);
  return {
    locks,
    event,
    me: state.me,
    locked: typeof locked !== 'undefined' ? locked : new Date().toJSON() >= locks
  };
};

const mapDispatchToProps = (dispatch) => ({
  meActions: bindActionCreators(meActionCreators, dispatch),
  eventActions: bindActionCreators(eventActionCreators, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    children: PropTypes.node,
    lockedComponent: PropTypes.node,
    unlockedComponent: PropTypes.node
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
    this.endCountdown();
  }

  endCountdown() {
    if (this.cancelCountdown) {
      this.cancelCountdown();
    }
  }

  startCountdown(props) {
    if (props.locked) return;

    // Start a countdown to lock the event
    this.endCountdown();
    this.cancelCountdown = countdown(props.locks, () => props.eventActions.lock(props.event));
  }

  render() {
    const {me, event, meActions, locked, locks} = this.props;
    const {routes, params, location} = this.props;
    const {children, lockedComponent, unlockedComponent} = this.props;

    let renderedChild, getEventPath;

    if (lockedComponent && unlockedComponent) {
      renderedChild = locked ? lockedComponent : unlockedComponent;
      getEventPath = renderedChild.type.getEventPath;
    }
    else {
      renderedChild = children;
      getEventPath = last(routes).component.getEventPath;
    }

    return (
      <div className='main-container'>
        <Header
          eventPath={getEventPath ? (e) => getEventPath(e, params, location.query) : null}
          me={me}
          event={event}
          onLogin={meActions.login}
          onLogout={meActions.logout}
        />
        {React.cloneElement(renderedChild, {locked, event, locks})}
        <Footer />
      </div>
    );
  }
}
