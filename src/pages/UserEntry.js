import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import mergeSyncState from '../lib/mergeSyncState';
import * as entryActions from '../actions/entries';
import * as mastersActions from '../actions/masters';
import eventSelector from '../selectors/event';
import * as bracketSelectors from '../selectors/bracket';
import * as entriesSelectors from '../selectors/entries';
import * as mastersSelectors from '../selectors/masters';

import Page from '../components/containers/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import LockMessage from '../components/bracket/LockMessage';
import UserInfo from '../components/user/Info';

const mapStateToProps = (state, props) => ({
  event: eventSelector(state),
  lock: bracketSelectors.lock(state),
  diff: bracketSelectors.diff(state),
  master: mastersSelectors.bracketString(state),
  entry: entriesSelectors.currentWithUser(state),
  sync: mergeSyncState(state.entries, state.masters),
  id: props.routeParams.id
});

const mapDispatchToProps = (dispatch) => ({
  entryActions: bindActionCreators(entryActions, dispatch),
  mastersActions: bindActionCreators(mastersActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class UserEntry extends Component {
  static propTypes = {
    event: PropTypes.object,
    lock: PropTypes.object,
    diff: PropTypes.func,
    entry: PropTypes.object,
    master: PropTypes.string,
    sync: PropTypes.object,
    entryActions: PropTypes.object,
    mastersActions: PropTypes.object,
    id: PropTypes.string
  };

  static getEventPath = (e, params) => `${e}/users/${params.userId}`;

  componentDidMount() {
    this.props.entryActions.fetchOne(this.props.id);
    this.props.mastersActions.fetchOne(this.props.event.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.props.entryActions.fetchOne(nextProps.id);
    }
    if (nextProps.event.id !== this.props.event.id) {
      this.props.mastersActions.fetchOne(nextProps.event.id);
    }
  }

  render() {
    const {sync, entry, master, diff, lock, event} = this.props;

    return (
      <Page sync={sync} width='full'>
        <LockMessage lock={lock} event={event} />
        <UserInfo user={entry.user} />
        <DiffBracket {...{diff, entry: entry.bracket, master}} />
      </Page>
    );
  }
}
