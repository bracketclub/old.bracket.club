/* global __MOCK__ */

import React, {PropTypes, Component} from 'react';
import qs from 'query-string';
import {Button, Popover, Alert, OverlayTrigger} from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import dateFormat from 'dateformat';
import CSSModules from 'react-css-modules';

const isOpen = (id) => __MOCK__.indexOf(id) === -1;
const formatter = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''}`;

@CSSModules(require('./styles/EnterButton.less'))
export default class BracketEnterButton extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    bracket: PropTypes.string.isRequired,
    onEnter: PropTypes.func.isRequired,
    locks: PropTypes.string.isRequired,
    progress: PropTypes.object.isRequired
  };

  getHref() {
    const {event, bracket} = this.props;

    const tweetQs = qs.stringify({
      text: 'Already planning my #bracket!',
      url: `http://tweetyourbracket.com/${event.id}/entry/${bracket}`,
      hashtags: 'tybrkt',
      lang: 'en',
      related: 'tweetthebracket',
      via: 'tweetthebracket',
      count: 'none'
    });

    return `https://twitter.com/share?${tweetQs}`;
  }

  getOverlay() {
    const {onEnter, bracket, locks, event} = this.props;
    const open = isOpen(event.id);

    const popover = (
      <Popover id='enter-popover'>
        <p>You'll be taken to <strong>twitter.com</strong> to tweet your bracket!</p>
        {open &&
          <Alert bsStyle='info'>
            Don't alter the <strong>url</strong> or <strong>#tybrkt hashtag</strong> of the tweet.
            {' '}
            We use those to verify your entry.
          </Alert>
        }
        {!open &&
          <Alert bsStyle='info'>
            <strong>Hey!</strong>
            {' '}
            Entries aren't open yet (this is just the the latest projected bracket).
            You're welcome to tweet it, but make sure to come back before
            {' '}
            <strong>{dateFormat(new Date(locks), 'mmmm dS h:MMTT')}</strong>
            {' '}
            to tweet your bracket for real.
          </Alert>
        }
      </Popover>
    );

    return (
      <OverlayTrigger trigger={['hover', 'focus']} placement='bottom' overlay={popover}>
        <Button
          styleName='enter-button'
          bsStyle='primary'
          block
          href={this.getHref()}
          onClick={() => onEnter(bracket)}
          target='_blank'
        >
          Tweet My Bracket!
        </Button>
      </OverlayTrigger>
    );
  }

  getLock() {
    const {locks} = this.props;

    return (
      <Button
        disabled
        block
        bsStyle='primary'
        componentClass='button'
        styleName='enter-button'
      >
        Entries lock in <TimeAgo date={locks} formatter={formatter} />
      </Button>
    );
  }

  render() {
    const {progress, locks} = this.props;

    return (
      <div className='bracket-enter' title={progress.complete ? '' : locks}>
        {progress.complete ? this.getOverlay() : this.getLock()}
      </div>
    );
  }
}
