import React, {Component, PropTypes} from 'react';

import Bracket from './Bracket';

export default class DiffBracket extends Component {
  static propTypes = {
    diff: PropTypes.func,
    entry: PropTypes.string,
    master: PropTypes.string
  };

  render() {
    const {
      diff,
      entry,
      master
    } = this.props;

    if (!diff || !entry || !master) {
      return null;
    }

    return (
      <Bracket bracket={diff({entry, master})} />
    );
  }
}
