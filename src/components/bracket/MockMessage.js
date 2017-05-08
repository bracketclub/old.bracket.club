import config from 'config';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'react-bootstrap';
import {Link} from 'react-router';

export default class MockMessage extends Component {
  static propTypes = {
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
        <strong>Entries aren’t open yet!</strong>
        {' '}
        But you’re welcome to play around with the latest projected bracket if you are as excited as I am to get started.
        <br className='visible-lg-block' />
        {' '}
        <strong>
          <Link to='/subscribe'>Subscribe</Link> to email updates or follow <a target='_blank' rel='noopener noreferrer' href={`https://twitter.com/${config.twitter.handle}`}>@{config.twitter.handle}</a> on Twitter to be the first to know when entries are open.
        </strong>
      </Alert>
    );
  }
}
