import React, {Component} from 'react';
import charCodes from 'lib/charCodes';

export default class Footer extends Component {
  render() {
    const {event, locked} = this.props;

    return (
      <footer>
        <ul className='footer-links'>
          <li><a target='_blank' href='https://twitter.com/tweetthebracket'>Twitter</a></li>
          <li className='muted'>{charCodes.dot}</li>
          <li><a target='_blank' href='https://github.com/tweetyourbracket'>GitHub</a></li>
          {!locked && <li className='muted'>{charCodes.dot}</li>}
          {!locked && <li><a target='_blank' href={`/${event.id}/zen`}>Zen/Baby Mode</a></li>}
        </ul>
        <p className='twitter'>
          <a target='_blank' className='twitter-follow-button' href='https://twitter.com/TweetTheBracket' data-show-count='false'>
            Follow @TweetTheBracket
          </a>
        </p>
        <p className='text-muted'>Made with ♥️ by <a target='_blank' href='http://lukekarrys.com'>Luke</a> in AZ.</p>
      </footer>
    );
  }
}
