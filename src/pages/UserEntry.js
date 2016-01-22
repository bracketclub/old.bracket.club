import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mapDispatchToProps from '../lib/mapDispatchToProps';
import mergeSyncState from '../lib/mergeSyncState';

import * as entryActions from '../actions/entries';
import * as mastersActions from '../actions/masters';
import * as bracketSelectors from '../selectors/bracket';
import * as entriesSelectors from '../selectors/entries';
import * as mastersSelectors from '../selectors/masters';

import Page from '../components/containers/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import LockMessage from '../components/bracket/LockMessage';
import UserInfo from '../components/user/Info';

const mapStateToProps = (state, props) => ({
  diff: bracketSelectors.diff(state, props),
  master: mastersSelectors.bracketString(state, props),
  entry: entriesSelectors.currentWithUser(state, props),
  sync: mergeSyncState(state.entries, state.masters)
});

@connect(mapStateToProps, mapDispatchToProps({entryActions, mastersActions}))
export default class UserEntry extends Component {
  static propTypes = {
    diff: PropTypes.func,
    entry: PropTypes.object,
    master: PropTypes.string,
    sync: PropTypes.object
  };

  static getEventPath = (e, params) => `${e}/users/${params.userId}`;

  componentDidMount() {
    this.props.entryActions.fetchOne(this.props.params.entryId);
    this.props.mastersActions.fetchOne(this.props.event.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.entryId !== this.props.params.entryId) {
      nextProps.entryActions.fetchOne(nextProps.params.entryId);
    }
    if (nextProps.event.id !== this.props.event.id) {
      nextProps.mastersActions.fetchOne(nextProps.event.id);
    }
  }

  render() {
    const {sync, entry, master, diff, locks, event, locked} = this.props;

    return (
      <Page sync={sync} width='full'>
        <LockMessage locked={locked} locks={locks} event={event} />
        <UserInfo user={entry.user} />
        <DiffBracket {...{diff, entry: entry.bracket, master}} />
      </Page>
    );
  }
}
