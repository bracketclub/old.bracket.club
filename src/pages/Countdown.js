/* eslint no-magic-numbers:0 */

import React, {Component} from 'react';
import {PageHeader} from 'react-bootstrap';
import raf from 'raf';
import zero from 'zero-fill';
import displayName from 'lib/eventDisplayName';

import Page from '../components/layout/Page';

const LOCK_MSG = 'This event is locked!';

const readable = (date) => {
  const input = (new Date(date)).valueOf() - Date.now();

  const hours = input / (1000 * 60 * 60);
  const h = Math.floor(hours);

  const minutes = (hours - h) * 60;
  const m = Math.floor(minutes);

  const seconds = (minutes - m) * 60;
  const s = Math.floor(seconds);

  const milliseconds = (seconds - s) * 1000;
  const ms = Math.floor(milliseconds);

  return `${zero(2, h)}:${zero(2, m)}:${zero(2, s)}.${zero(3, ms)}`;
};

export default class Countdown extends Component {
  static getEventPath = (e) => ({pathname: `/${e}/countdown`});

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
    const {event} = this.props;
    const {message} = this.state;

    return (
      <Page>
        <PageHeader className='text-center'>{displayName(event)} Countdown</PageHeader>
        <h1 className='text-center'>{message}</h1>
      </Page>
    );
  }
}
