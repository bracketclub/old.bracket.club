'use strict';

import React, {Component, PropTypes} from 'react';
import {Alert} from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import {Link} from 'react-router';

const formatter = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''}`;

export default class LockMessage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    lock: PropTypes.object.isRequired
  };

  render() {
    const {
      event,
      lock
    } = this.props;

    if (lock.isLocked()) {
      return null;
    }

    return (
      <Alert bsStyle='info'>
        Entries are still open for {event.displayName} for another <TimeAgo formatter={formatter} date={lock.timeLeft} />.
        Go to the <Link to={`/${event.id}`}>entry page</Link> to fill out your bracket before it's too late!
      </Alert>
    );
  }
}
