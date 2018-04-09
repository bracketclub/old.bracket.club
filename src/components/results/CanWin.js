import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Glyphicon} from 'react-bootstrap';

// Only allow can win checks if it past the second round
const CAN_WIN_MAX_REMAINING = 15;
const CHECK_GLYPH = <Glyphicon className='text-muted' glyph='question-sign' />;
const ELIMINATED_GLYPH = <Glyphicon className='text-danger' glyph='remove-sign' />;
const ALIVE_GLYPH = <Glyphicon className='text-success' glyph='ok-sign' />;

const hideCanWin = ({remaining, total}) => (
  remaining > CAN_WIN_MAX_REMAINING ||
  remaining === 0 ||
  remaining === total
);

class CanWinLegend extends Component {
  static propTypes = {
    progress: PropTypes.object
  };

  render() {
    const {progress} = this.props;

    if (hideCanWin(progress)) {
      return null;
    }

    return (
      <p>
        {CHECK_GLYPH} Check if entry can still win
        {' — '}
        {ELIMINATED_GLYPH} Entry has been eliminated
        {' — '}
        {ALIVE_GLYPH} Entry is still alive!
        <br />
        <em>Entries with lower PPR may take a few minutes to calculate.</em>
      </p>
    );
  }
}

export {CanWinLegend as Legend};

export default class EntryCanWin extends Component {
  static propTypes = {
    onCanWinCheck: PropTypes.func.isRequired,
    entry: PropTypes.object.isRequired,
    progress: PropTypes.object
  };

  render() {
    const {entry, onCanWinCheck, progress} = this.props;
    const {canWin, id} = entry;

    if (hideCanWin(progress)) {
      return null;
    }

    if (typeof canWin === 'undefined') {
      return (
        <a href='#' onClick={(e) => onCanWinCheck(e, id)}>{CHECK_GLYPH}</a>
      );
    }

    if (canWin.loading) {
      return (
        <Glyphicon glyph='hourglass' />
      );
    }

    if (canWin.error) {
      return (
        <Glyphicon glyph='alert' className='text-danger' />
      );
    }

    if (!canWin.bracket) {
      return ELIMINATED_GLYPH;
    }

    return ALIVE_GLYPH;
  }
}

