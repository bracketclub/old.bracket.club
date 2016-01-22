import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mapDispatchToProps from '../lib/mapDispatchToProps';

import * as bracketSelectors from '../selectors/bracket';
import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';

import Page from '../components/containers/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import LockMessage from '../components/bracket/LockMessage';

const mapStateToProps = (state, props) => ({
  diff: bracketSelectors.diff(state, props),
  master: mastersSelectors.bracketString(state, props),
  sync: state.masters.sync
});

@connect(mapStateToProps, mapDispatchToProps({mastersActions}))
export default class CreatedEntry extends Component {
  static propTypes = {
    master: PropTypes.string,
    entry: PropTypes.string,
    diff: PropTypes.func,
    sync: PropTypes.object
  };

  static getEventPath = (e) => e;

  componentDidMount() {
    this.mastersActions.fetchOne(this.props.event.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.event.id !== this.props.event.id) {
      this.mastersActions.fetchOne(nextProps.event.id);
    }
  }

  render() {
    const {
      diff,
      master,
      event,
      locks,
      locked,
      sync
    } = this.props;

    const {bracket} = this.props.params;

    return (
      <Page width='full' sync={sync}>
        <LockMessage locked={locked} locks={locks} event={event} />
        <DiffBracket {...{diff, entry: bracket, master}} />
      </Page>
    );
  }
}
