import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import charCodes from 'lib/charCodes';
import styles from './index.less';

@CSSModules(styles)
export default class Footer extends Component {
  render() {
    const {event, locked} = this.props;

    return (
      <footer styleName='footer'>
        <ul styleName='footer-links'>
          <li><a target='_blank' href='https://twitter.com/tweetthebracket'>Twitter</a></li>
          <li styleName='muted'>{charCodes.dot}</li>
          <li><a target='_blank' href='https://github.com/bracketclub'>GitHub</a></li>
          {!locked && <li styleName='muted'>{charCodes.dot}</li>}
          {!locked && <li><a target='_blank' href={`/${event.id}/zen`}>Zen/Baby Mode</a></li>}
        </ul>
        <p styleName='twitter'>
          <a target='_blank' className='twitter-follow-button' href='https://twitter.com/TweetTheBracket' data-show-count='false'>
            Follow @TweetTheBracket
          </a>
        </p>
        <p styleName='muted'>Made with ♥️ by <a target='_blank' href='http://lukekarrys.com'>Luke</a> in AZ.</p>
      </footer>
    );
  }
}
