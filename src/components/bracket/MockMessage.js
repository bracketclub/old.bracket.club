import React, {Component, PropTypes} from 'react';
import {Alert} from 'react-bootstrap';
import {Link} from 'react-router';

export default class MockMessage extends Component {
  static propTypes = {
    mocked: PropTypes.bool.isRequired,
    locks: PropTypes.string.isRequired
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
      mocked
    } = this.props;

    const {
      visible
    } = this.state;

    if (!mocked || !visible) {
      return null;
    }

    return (
      <Alert className='margin-collapse mt1 text-center' bsStyle='info' onDismiss={this.hideAlert}>
        <strong>Entries aren't open yet!</strong>
        {' '}
        But you're welcome to play around with the latest projected bracket if you are as excited as I am for March Madness.
        <br className='visible-lg-block' />
        {' '}
        <strong>
          <Link to='/subscribe'>Subscribe</Link> to email updates or follow <a href='https://twitter.com/tweetthebracket'>@tweetthebracket</a> on Twitter to be the first to know when entries are open.
        </strong>
      </Alert>
    );
  }
}
