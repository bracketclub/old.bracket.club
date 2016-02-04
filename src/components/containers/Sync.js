import React, {Component, PropTypes} from 'react';

import Error from '../layout/Error';
import Loading from '../layout/Loading';

export default class SyncContainer extends Component {
  static propTypes = {
    sync: PropTypes.object,
    children: PropTypes.node
  };

  render() {
    const {sync, children} = this.props;

    if (sync && sync.syncing) {
      return <Loading />;
    }

    if (sync && sync.lastError) {
      return <Error error={sync.lastError} />;
    }

    // Ensure we always render 1 child
    return <div>{children}</div>;
  }
}
