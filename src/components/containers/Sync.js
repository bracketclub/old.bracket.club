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

    if (sync && sync.fetchError) {
      return <Error error={sync.fetchError} />;
    }

    // Ensure 1 child is always rendered
    return <div>{children}</div>;
  }
}
