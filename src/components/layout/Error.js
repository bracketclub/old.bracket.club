import React, {Component, PropTypes} from 'react';
import {Alert} from 'react-bootstrap';

export default class Error extends Component {
  static propTypes = {
    error: PropTypes.object
  };

  render() {
    const {error} = this.props;

    return (
      <Alert bsStyle='danger'>
        <h4>API Error</h4>
        <p>{error.status} {error.error}</p>
        <p>{error.message}</p>
      </Alert>
    );
  }
}
