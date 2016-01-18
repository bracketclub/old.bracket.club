'use strict';

import React, {Component} from 'react';

const middot = String.fromCharCode(183);

export default class Footer extends Component {
  static propTypes = {
    className: React.PropTypes.string
  };

  render() {
    return (
      <footer>
        <div className={this.props.className}>
          <ul className='footer-links'>
            <li><a href='https://twitter.com/tweetthebracket'>Twitter</a></li>
            <li className='muted'>{middot}</li>
            <li><a href='https://github.com/tweetyourbracket'>GitHub</a></li>
            <li className='muted'>{middot}</li>
            <li><a href='http://lukecod.es/2014/01/25/tweet-your-bracket/'>What Is This?</a></li>
          </ul>
          <p>
            <a className='twitter-follow-button' href='https://twitter.com/TweetTheBracket' data-show-count='false'>
              Follow @TweetTheBracket
            </a>
          </p>
          <p>Made with love by <a href='http://lukekarrys.com'>Luke</a> in Arizona.</p>
        </div>
      </footer>
    );
  }
}
