'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as userActions from '../actions/users';
import * as usersSelectors from '../selectors/users';

import Page from '../components/containers/Page';
import UserEntries from '../components/user/Entries';
import UserInfo from '../components/user/Info';

const mapStateToProps = (state, props) => ({
  user: usersSelectors.currentWithEntries(state),
  sync: state.users.sync,
  id: props.routeParams.id
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(userActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class UserProfile extends Component {
  static propTypes = {
    sync: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  };

  fetchData(props) {
    return props.userActions.fetchOne(props.id);
  }

  componentDidMount() {
    return this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      return this.fetchData(nextProps);
    }
  }

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
