import React, {PropTypes, Component} from 'react';
import qs from 'query-string';
import {Button, Popover, Alert, OverlayTrigger} from 'react-bootstrap';
import TimeAgo from 'react-timeago';

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
      text: 'Check out my #bracket!',
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
    const {onEnter, bracket, locks} = this.props;

    const popover = (
      <Popover id='enter-popover'>
        <p>You'll be taken to <strong>twitter.com</strong> to tweet your bracket!</p>
        <Alert bsStyle='info'>
          <strong>Important!</strong> Don't alter the <strong>url</strong> or <strong>#tybrkt hashtag</strong> of the tweet. We use those to verify your entry.
        </Alert>
      </Popover>
    );

    return (
      <OverlayTrigger trigger={['hover', 'focus']} placement='bottom' overlay={popover}>
        <Button
          bsStyle='primary'
          block
          href={this.getHref()}
          onClick={() => onEnter(bracket)}
          target='_blank'
        >
          Tweet My Bracket! <TimeAgo date={locks} />
        </Button>
      </OverlayTrigger>
    );
  }

  getLock() {
    const {locks} = this.props;

    return (
      <Button disabled block bsStyle='primary' componentClass='button'>
        Brackets lock <TimeAgo date={locks} />
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
