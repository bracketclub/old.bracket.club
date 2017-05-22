import React, {Component} from 'react';
import PropTypes from 'prop-types';
import raf from 'raf';
import zero from 'zero-fill';

const LOCK_MSG = 'This event is locked!';

const readable = (date) => {
  const input = (new Date(date)).valueOf() - Date.now();
  const MS = 1000;
  const SEC = 60;
  const MIN = 60;
  const DIGITS = {h: 2, m: 2, s: 2, ms: 3};

  const hours = input / (MS * SEC * MIN);
  const h = Math.floor(hours);

  const minutes = (hours - h) * MIN;
  const m = Math.floor(minutes);

  const seconds = (minutes - m) * SEC;
  const s = Math.floor(seconds);

  const milliseconds = (seconds - s) * MS;
  const ms = Math.floor(milliseconds);

  return `${zero(DIGITS.h, h)}:${zero(DIGITS.m, m)}:${zero(DIGITS.s, s)}.${zero(DIGITS.ms, ms)}`;
};

export default class Countdown extends Component {
  static propTypes = {
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      message: props.locked ? LOCK_MSG : readable(props.locks)
    };
  }

  componentDidMount() {
    this.tick();
  }

  componentDidUpdate(lastProps) {
    if (this.props.locks !== lastProps.locks || this.props.locked !== lastProps.locked) {
      this.tick();
    }
  }

  componentWillUnmount() {
    this.cancelTick();
  }

  cancelTick() {
    if (this.timeoutId) {
      raf.cancel(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  tick() {
    const {locks, locked} = this.props;

    if (locked) {
      this.cancelTick();
      this.setState({message: LOCK_MSG});
      return;
    }

    this.timeoutId = raf(() => this.tick());
    this.setState({message: readable(locks)});
  }

  render() {
    const {message} = this.state;

    return (
      <span>{message}</span>
    );
  }
}
