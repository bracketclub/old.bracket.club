import React, {Component, PropTypes} from 'react';

import Bracket from './Bracket';

export default class LiveBracket extends Component {
  static propTypes = {
    onUpdate: PropTypes.func,
    bracket: PropTypes.string,
    finalId: PropTypes.string,
    validate: PropTypes.func
  };

  render() {
    const {
      bracket,
      validate,
      onUpdate,
      finalId
    } = this.props;

    if (!bracket || !validate || !onUpdate) {
      return null;
    }

    return (
      <Bracket bracket={validate(bracket)} finalId={finalId} onUpdate={onUpdate} />
    );
  }
}
