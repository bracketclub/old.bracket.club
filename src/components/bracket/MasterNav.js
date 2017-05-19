import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import * as bracketSelectors from '../../selectors/bracket';
import * as mastersSelectors from '../../selectors/masters';
import * as eventSelectors from '../../selectors/event';
import * as mastersActions from '../../actions/masters';
import BracketNav from './Nav';
import BracketProgress from './Progress';
import BracketHeader from './Header';
import LockMessage from './LockMessage';

const mapStateToProps = mapSelectorsToProps({
  navigation: mastersSelectors.navigation,
  progress: mastersSelectors.progress,
  bestOf: bracketSelectors.bestOf,
  locked: bracketSelectors.locked,
  locks: bracketSelectors.locks,
  event: eventSelectors.info,
  mocked: bracketSelectors.mocked
});

@connect(mapStateToProps, mapDispatchToProps({mastersActions}))
export default class MasterNav extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types, (gets used by selectors)
    location: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    mocked: PropTypes.bool.isRequired,
    bestOf: PropTypes.object,
    user: PropTypes.object
  };

  handleNavigate = (method) => {
    this.props.mastersActions.navigate(method);
  };

  render() {
    const {navigation, progress, locked, locks, event, mocked, user, bestOf} = this.props;

    return (
      <div>
        <BracketHeader>
          <BracketNav
            navigation={navigation}
            onNavigate={this.handleNavigate}
          />
          <BracketProgress
            message={bestOf ? 'series played' : 'games played'}
            progress={progress}
          />
        </BracketHeader>
        <LockMessage
          mocked={mocked}
          locked={locked}
          locks={locks}
          event={event}
          user={user}
        />
      </div>
    );
  }
}
