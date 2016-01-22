import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Alert} from 'react-bootstrap';
import mapDispatchToProps from '../lib/mapDispatchToProps';
import mergeSyncState from '../lib/mergeSyncState';

import * as usersActions from '../actions/users';
import * as mastersActions from '../actions/masters';
import * as bracketSelectors from '../selectors/bracket';
import * as usersSelectors from '../selectors/users';
import * as mastersSelectors from '../selectors/masters';

import Page from '../components/containers/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import UserInfo from '../components/user/Info';

const mapStateToProps = (state, props) => ({
  diff: bracketSelectors.diff(state, props),
  master: mastersSelectors.bracketString(state, props),
  user: usersSelectors.currentWithEntryByEvent(state, props),
  sync: mergeSyncState(state.entries, state.masters)
});

@connect(mapStateToProps, mapDispatchToProps({usersActions, mastersActions}))
export default class LookupEntry extends Component {
  static propTypes = {
    diff: PropTypes.func,
    user: PropTypes.object,
    master: PropTypes.string,
    sync: PropTypes.object
  };

  static getEventPath = (e, params) => `${e}/users/${params.userId}`;

  componentDidMount() {
    this.props.usersActions.fetchOne(`${this.props.params.userId}/${this.props.event.id}`);
    this.props.mastersActions.fetchOne(this.props.event.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.userId !== this.props.params.userId || nextProps.event.id !== this.props.event.id) {
      this.props.usersActions.fetchOne(`${nextProps.params.userId}/${nextProps.event.id}`);
    }
    if (nextProps.event.id !== this.props.event.id) {
      this.props.mastersActions.fetchOne(nextProps.event.id);
    }
  }

  render() {
    const {sync, user, master, diff} = this.props;
    const {entry} = user;

    return (
      <Page sync={{syncing: sync.syncing}} width='full'>
        <UserInfo user={user} />
        {entry
          ? <DiffBracket {...{diff, entry: entry.bracket, master}} />
          : <Alert bsStyle='warning'>This user does not have an entry for this event.</Alert>
        }
      </Page>
    );
  }
}
