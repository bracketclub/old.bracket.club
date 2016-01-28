import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from '../lib/fetchDecorator';

import * as usersActions from '../actions/users';
import * as usersSelectors from '../selectors/users';

import Page from '../components/layout/Page';
import UserEntries from '../components/user/Entries';
import UserInfo from '../components/user/Info';

const mapStateToProps = (state, props) => ({
  user: usersSelectors.currentWithEntries(state, props),
  sync: state.users.sync
});

const mapPropsToActions = (props) => ({
  users: [usersActions.fetchOne, props.params.userId]
});

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class UserProfilePage extends Component {
  static propTypes = {
    sync: PropTypes.object,
    user: PropTypes.object
  };
  render() {
    const {sync, user} = this.props;

    return (
      <Page sync={sync}>
        <UserInfo user={user} />
        <UserEntries user={user} />
      </Page>
    );
  }
}
