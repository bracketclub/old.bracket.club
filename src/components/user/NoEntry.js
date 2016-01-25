import React, {Component, PropTypes} from 'react';
import {Alert} from 'react-bootstrap';
import {Link} from 'react-router';

export default class UserNoEntry extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  render() {
    const {
      user
    } = this.props;

    return (
      <Alert bsStyle='info'>
        <strong>@{user.username}</strong> does not have an entry for this event.
        {' '}
        Go to their <Link to={`/users/${user.user_id}`}>user page</Link> to see all their entries.
      </Alert>
    );
  }
}
