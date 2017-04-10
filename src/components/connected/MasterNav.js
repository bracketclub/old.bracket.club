import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';

import * as mastersSelectors from '../../selectors/masters';
import * as mastersActions from '../../actions/masters';

import BracketNav from '../bracket/Nav';
import BracketProgress from '../bracket/Progress';
import BracketHeader from '../bracket/Header';
import LockMessage from '../bracket/LockMessage';

const mapStateToProps = mapSelectorsToProps({
  navigation: mastersSelectors.navigation,
  progress: mastersSelectors.progress
});

@connect(mapStateToProps, mapDispatchToProps({mastersActions}))
export default class MasterNav extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    progress: PropTypes.object,
    user: PropTypes.object
  };

  handleNavigate = (method) => {
    this.props.mastersActions.navigate(method);
  };

  render() {
    const {navigation, progress, locked, locks, event, mocked, user} = this.props;

    return (
      <div>
        <BracketHeader>
          <BracketNav
            navigation={navigation}
            onNavigate={this.handleNavigate}
          />
          <BracketProgress message='games played' progress={progress} />
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
