import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import * as bracketSelectors from '../selectors/bracket';

import MasterBracket from './MasterBracket';
import LiveEntry from './LiveEntry';

const mapStateToProps = (state) => ({
  lock: bracketSelectors.lock(state)
});

@connect(mapStateToProps)
export default class LiveOrMaster extends Component {
  static propTypes = {
    lock: PropTypes.object.isRequired
  };

  static getEventPath = (e) => e;

  render() {
    const {lock} = this.props;

    return lock.isLocked()
      ? <MasterBracket {...this.props} />
      : <LiveEntry {...this.props} />;
  }
}
