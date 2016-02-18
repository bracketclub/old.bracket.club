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

  constructor(props) {
    super(props);
    this.state = {visible: true};
  }

  hideAlert = () => {
    this.setState({visible: false});
  };

  render() {
    const {
      event,
      locks,
      locked,
      mocked
    } = this.props;

    const {
      visible
    } = this.state;

    if (locked || mocked || !visible) {
      return null;
    }

    return (
      <Alert className='margin-collapse mt1 text-center' bsStyle='info' onDismiss={this.hideAlert}>
        Entries are still open for the <strong>{event.display} Bracket</strong> for <TimeAgo formatter={formatter} date={locks} />.
        <br className='visible-lg-block' />
        {' '}
        Go to the <Link to={`/${event.id}`}>entry page</Link> to fill out your bracket before it's too late!
      </Alert>
    );
  }
}
