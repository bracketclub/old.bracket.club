import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import fetch from 'lib/fetchDecorator';
import * as usersActions from '../actions/users';
import * as usersSelectors from '../selectors/users';
import Page from '../components/layout/Page';
import UserEntries from '../components/user/Entries';
import UserInfo from '../components/user/Info';

const mapStateToProps = mapSelectorsToProps({
  user: usersSelectors.userWithEntries,
  sync: usersSelectors.sync
});

const mapPropsToActions = (props) => ({
  users: [usersActions.fetch, props.match.params.userId, usersActions.sse]
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
