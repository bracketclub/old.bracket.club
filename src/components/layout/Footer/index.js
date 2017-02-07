import config from 'config';
import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import charCodes from 'lib/charCodes';
import styles from './index.less';

const twitter = config.twitter.handle;

@CSSModules(styles)
export default class Footer extends Component {
  render() {
    const {event, locked} = this.props;

    return (
      <footer styleName='footer'>
        <ul styleName='footer-links'>
          <li><a target='_blank' href={`https://twitter.com/${twitter}`}>Twitter</a></li>
          <li styleName='muted'>{charCodes.dot}</li>
          <li><a target='_blank' href='https://github.com/bracketclub'>GitHub</a></li>
          {!locked && <li styleName='muted'>{charCodes.dot}</li>}
          {!locked && <li><a target='_blank' href={`/${event.id}/zen`}>Zen/Baby Mode</a></li>}
        </ul>
        <p styleName='twitter'>
          <a target='_blank' className='twitter-follow-button' href={`https://twitter.com/${twitter}`} data-show-count='false'>
            Follow @{twitter}
          </a>
        </p>
        <p styleName='muted'>Made with ♥️ by <a target='_blank' href='http://lukekarrys.com'>Luke</a> in AZ.</p>
      </footer>
    );
  }
}
