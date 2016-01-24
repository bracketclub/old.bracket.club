import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Alert} from 'react-bootstrap';
import fetch from '../lib/fetchDecorator';
import mergeSyncState from '../lib/mergeSyncState';

import * as usersActions from '../actions/users';
import * as mastersActions from '../actions/masters';
import * as bracketSelectors from '../selectors/bracket';
import * as usersSelectors from '../selectors/users';
import * as mastersSelectors from '../selectors/masters';

import Page from '../components/containers/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';
import LockMessage from '../components/bracket/LockMessage';
import UserInfo from '../components/user/Info';

const mapStateToProps = (state, props) => ({
  diff: bracketSelectors.diff(state, props),
  master: mastersSelectors.bracketString(state, props),
  navigation: mastersSelectors.navigation(state, props),
  progress: mastersSelectors.progress(state, props),
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
    sync: PropTypes.object,
    navigation: PropTypes.object,
    progress: PropTypes.object
  };

  static getEventPath = (e, params) => `${e}/users/${params.userId}`;

  handleNavigate = (method) => {
    this.props.dispatch(mastersActions[method]());
  };

  render() {
    const {sync, user, master, diff, locked, locks, event, navigation, progress} = this.props;
    const {entry} = user;

    return (
      <Page sync={sync} width='full'>
        <BracketHeader>
          <BracketNav navigation={navigation} event={event} onNavigate={this.handleNavigate} />
          <BracketProgress message='games played' progress={progress} />
        </BracketHeader>
        <LockMessage locked={locked} locks={locks} event={event} />
        <UserInfo user={user} />
        {entry
          ? <DiffBracket {...{diff, entry: entry.bracket, master}} />
          : <Alert bsStyle='warning'>This user does not have an entry for this event.</Alert>
        }
      </Page>
    );
  }
}
