'use strict';

import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {PageHeader} from 'react-bootstrap';

export default class UserInfo extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  static defaultProps = {
    user: {}
  };

  render() {
    const {user} = this.props;

    return (
      <PageHeader>
        <Link to={`/users/${user.user_id}`}>{user.username}</Link>
        <a className='twitter' href={`https://twitter.com/${user.username}`}>
          <img src='//g.twimg.com/Twitter_logo_blue.png' />
        </a>
      </PageHeader>
    );
  }
}
