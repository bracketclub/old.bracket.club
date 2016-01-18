import React, {Component, PropTypes, Children} from 'react';
import {Alert} from 'react-bootstrap';

export default class SyncContainer extends Component {
  static propTypes = {
    delayLoading: PropTypes.number,
    sync: PropTypes.object,
    children: PropTypes.node
  };

  static defaultProps = {
    delayLoading: 400
  };

  constructor() {
    super();
    this.state = {showLoading: true};
  }

  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({showLoading: true});
    }, this.props.delayLoading);
  }

  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }

  render() {
    const {sync, children} = this.props;

    if (sync && sync.syncing) {
      return this.state.showLoading ? <h1>Loading</h1> : null;
    }

    if (sync && sync.lastError) {
      return (
        <Alert bsStyle='danger'>
          <h4>API Error</h4>
          <p>{sync.lastError.status} {sync.lastError.error}</p>
          <p>{sync.lastError.message}</p>
        </Alert>
      );
    }

    // Ensure we always render 1 child
    return Children.count(children) === 1
      ? children
      : <div>{children}</div>;
  }
}
