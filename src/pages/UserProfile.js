import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mapDispatchToProps from '../lib/mapDispatchToProps';

import * as usersActions from '../actions/users';
import * as usersSelectors from '../selectors/users';

import Page from '../components/containers/Page';
import UserEntries from '../components/user/Entries';
import UserInfo from '../components/user/Info';

const mapStateToProps = (state, props) => ({
  user: usersSelectors.currentWithEntries(state, props),
  sync: state.users.sync
});

@connect(mapStateToProps, mapDispatchToProps({usersActions}))
export default class UserProfile extends Component {
  static propTypes = {
    sync: PropTypes.object,
    user: PropTypes.object
  };

  componentDidMount() {
    this.props.usersActions.fetchOne(this.props.params.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.userId !== this.props.params.userId) {
      nextProps.userActions.fetchOne(nextProps.params.userId);
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
