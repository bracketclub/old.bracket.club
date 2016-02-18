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
      <Alert className='margin-collapse mt1 text-center' onDismiss={this.hideAlert}>
        <strong>Entries aren't open yet!</strong>
        {' '}
        But you're welcome to play around with the latest projected bracket if you are as excited as we are for March Madness.
        <br className='visible-lg-block' />
        {' '}
        <strong>
          <Link to='/subscribe'>Subscribe</Link> to our email updates or follow us on Twitter <a href='https://twitter.com/tweetthebracket'>@tweetthebracket</a> to be the first to know when entries are open.
        </strong>
      </Alert>
    );
  }
}
