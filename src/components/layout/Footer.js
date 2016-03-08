import React, {Component} from 'react';
import charCodes from 'lib/charCodes';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <ul className='footer-links'>
          <li><a href='https://twitter.com/tweetthebracket'>Twitter</a></li>
          <li className='muted'>{charCodes.dot}</li>
          <li><a href='https://github.com/tweetyourbracket'>GitHub</a></li>
          <li className='muted'>{charCodes.dot}</li>
          <li><a href='http://lukecod.es/2014/01/25/tweet-your-bracket/'>What Is This?</a></li>
        </ul>
        <p className='twitter'>
          <a className='twitter-follow-button' href='https://twitter.com/TweetTheBracket' data-show-count='false'>
            Follow @TweetTheBracket
          </a>
        </p>
        <p className='text-muted'>Made with ♥️ by <a href='http://lukekarrys.com'>Luke</a> in AZ.</p>
      </footer>
    );
  }
}
