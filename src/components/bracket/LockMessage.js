import React, {Component, PropTypes} from 'react';
import {Alert} from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import {Link} from 'react-router';

const formatter = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''}`;

export default class LockMessage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    mocked: PropTypes.bool.isRequired
  };

  render() {
    const {
      event,
      locks,
      locked,
      mocked
    } = this.props;

    if (locked || mocked) {
      return null;
    }

    return (
      <Alert bsStyle='info'>
        Entries are still open for the <strong>{event.display} Bracket</strong> for <TimeAgo formatter={formatter} date={locks} />. Go to the <Link to={`/${event.id}`}>entry page</Link> to fill out your bracket before it's too late!
      </Alert>
    );
  }
}
