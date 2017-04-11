import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Bracket from './Bracket';

export default class DiffBracket extends Component {
  static propTypes = {
    diff: PropTypes.func,
    entry: PropTypes.string,
    master: PropTypes.string,
    bestOf: PropTypes.object
  };

  render() {
    const {
      diff,
      entry,
      master,
      bestOf
    } = this.props;

    if (!diff || !entry || !master) {
      return null;
    }

    return (
      <Bracket bracket={diff({entry, master})} bestOf={bestOf} diff />
    );
  }
}
