import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import mapDispatchToProps from '../../lib/mapDispatchToProps';

import * as mastersSelectors from '../../selectors/masters';
import * as mastersActions from '../../actions/masters';

import BracketNav from '../bracket/Nav';
import BracketProgress from '../bracket/Progress';
import BracketHeader from '../bracket/Header';
import LockMessage from '../bracket/LockMessage';

const mapStateToProps = (state, props) => ({
  navigation: mastersSelectors.navigation(state, props),
  progress: mastersSelectors.progress(state, props)
});

@connect(mapStateToProps, mapDispatchToProps({mastersActions}))
export default class MasterNav extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    progress: PropTypes.object
  };

  handleNavigate = (method) => {
    this.props.mastersActions[method]();
  };

  render() {
    const {navigation, progress, locked, locks, event} = this.props;

    return (
      <div>
        <BracketHeader>
          <BracketNav
            navigation={navigation}
            onNavigate={this.handleNavigate}
          />
          <BracketProgress message='games played' progress={progress} />
        </BracketHeader>
        <LockMessage locked={locked} locks={locks} event={event} />
      </div>
    );
  }
}
