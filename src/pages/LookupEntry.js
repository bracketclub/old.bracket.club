import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from '../lib/fetchDecorator';
import mergeSyncState from '../lib/mergeSyncState';

import * as usersActions from '../actions/users';
import * as mastersActions from '../actions/masters';
import * as bracketSelectors from '../selectors/bracket';
import * as usersSelectors from '../selectors/users';
import * as mastersSelectors from '../selectors/masters';

import Page from '../components/layout/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import MasterNav from '../components/connected/MasterNav';
import UserInfo from '../components/user/Info';
import UserNoEntry from '../components/user/NoEntry';

const mapStateToProps = (state, props) => ({
  diff: bracketSelectors.diff(state, props),
  master: mastersSelectors.bracketString(state, props),
  user: usersSelectors.currentWithEntryByEvent(state, props),
  sync: mergeSyncState(state.entries, state.masters)
});

const mapPropsToActions = (props) => ({
  users: [usersActions.fetchOne, `${props.params.userId}/${props.event.id}`],
  masters: [mastersActions.fetchOne, props.event.id]
});

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class LookupEntry extends Component {
  static propTypes = {
    diff: PropTypes.func,
    user: PropTypes.object,
    master: PropTypes.string,
    sync: PropTypes.object
  };

  static getEventPath = (e, params) => `${e}/users/${params.userId}`;

  render() {
    const {
      sync,
      user,
      master,
      diff
    } = this.props;

    const {entry} = user;

    return (
      <Page sync={sync} width='full'>
        <MasterNav {...this.props} />
        <UserInfo user={user} />
        {entry
          ? <DiffBracket {...{diff, entry: entry.bracket, master}} />
          : <UserNoEntry user={user} />
        }
      </Page>
    );
  }
}
