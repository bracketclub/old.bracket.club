import config from 'config'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import { connect } from 'react-redux'
import charCodes from 'lib/charCodes'
import mapSelectorsToProps from 'lib/mapSelectorsToProps'
import * as bracketSelectors from '../../../selectors/bracket'
import * as eventSelectors from '../../../selectors/event'
import styles from './index.less'

const twitter = config.twitter.handle

const mapStateToProps = mapSelectorsToProps({
  event: eventSelectors.info,
  locked: bracketSelectors.locked,
})

@connect(mapStateToProps)
@CSSModules(styles)
class Footer extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    locked: PropTypes.bool.isRequired,
  }

  render() {
    const { event, locked } = this.props

    return (
      <footer styleName="footer">
        <ul styleName="footer-links">
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://twitter.com/${twitter}`}
            >
              Twitter
            </a>
          </li>
          <li styleName="muted">{charCodes.dot}</li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/bracketclub"
            >
              GitHub
            </a>
          </li>
          {!locked && <li styleName="muted">{charCodes.dot}</li>}
          {!locked && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/${event.id}/zen`}
              >
                Zen Mode
              </a>
            </li>
          )}
        </ul>
        <p styleName="twitter">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="twitter-follow-button"
            href={`https://twitter.com/${twitter}`}
            data-show-count="false"
          >
            Follow @{twitter}
          </a>
        </p>
        <p styleName="muted">
          Made with ♥️ by{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://lukekarrys.com"
          >
            Luke
          </a>{' '}
          in AZ.
        </p>
      </footer>
    )
  }
}

export default Footer
