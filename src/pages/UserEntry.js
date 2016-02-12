import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import fetch from 'lib/fetchDecorator';
import mergeSyncState from 'lib/mergeSyncState';
import * as usersActions from '../actions/users';
import * as mastersActions from '../actions/masters';
import * as bracketSelectors from '../selectors/bracket';
import * as usersSelectors from '../selectors/users';
import * as mastersSelectors from '../selectors/masters';

import Page from '../components/layout/Page';
import MasterNav from '../components/connected/MasterNav';
import UserInfo from '../components/user/Info';
import UserEntry from '../components/user/Entry';
import ScoreCard from '../components/user/ScoreCard';

const mapStateToProps = (state, props) => ({
  diff: bracketSelectors.diff(state, props),
  master: mastersSelectors.bracketString(state, props),
  user: usersSelectors.currentWithEntry(state, props),
  sync: mergeSyncState(state.users, state.masters)
});

const mapPropsToActions = (props) => ({
  users: [usersActions.fetchOne, `${props.params.userId}/${props.event.id}`, usersActions.sse],
  masters: [mastersActions.fetchOne, props.event.id, mastersActions.sse]
});

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class UserEntryPage extends Component {
  static propTypes = {
    diff: PropTypes.func,
    user: PropTypes.object,
    master: PropTypes.string,
    sync: PropTypes.object
  };

  static getEventPath = (e, params, query) => ({pathname: `/${e}/entries/${params.userId}`, query});

  render() {
    const {
      sync,
      user,
      master,
      diff
    } = this.props;

    return (
      <Page sync={sync} width='full'>
        <MasterNav {...this.props} />
        <UserInfo user={user} />
        <ScoreCard score={user.score} />
        <UserEntry user={user} diff={diff} master={master} />
      </Page>
    );
  }
}
