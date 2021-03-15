import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import CSSModules from 'react-css-modules'
import { shuffle } from 'lodash'
import tweetHref from 'lib/tweetHref'
import styles from './index.less'

@CSSModules(styles)
export default class ZenBracket extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    locked: PropTypes.bool.isRequired,
    onUpdate: PropTypes.func,
    bracket: PropTypes.string,
    next: PropTypes.func,
    sensitive: PropTypes.bool,
  }

  state = {
    disabled: false,
  }

  componentDidMount() {
    const viewport = document.querySelector('meta[name=viewport]')
    this.previousViewport = viewport.content
    viewport.setAttribute('content', `${viewport.content},user-scalable=0`)

    document.documentElement.classList.add('hide-all')
  }

  componentWillUnmount() {
    const viewport = document.querySelector('meta[name=viewport]')
    viewport.setAttribute('content', this.previousViewport)

    document.documentElement.classList.remove('hide-all')
  }

  previousViewport = ''

  handleUpdate(e, team) {
    this.setState({ disabled: true })
    this.props.onUpdate({
      fromRegion: team.fromRegion,
      winner: {
        seed: team.seed,
        name: team.name,
      },
    })
    const WAIT = 100
    setTimeout(() => this.setState({ disabled: false }), WAIT)
  }

  renderButton(team, style) {
    const { sensitive } = this.props
    const { disabled } = this.state

    const handler = {}
    if (sensitive) {
      handler.onTouchStart = (e) => this.handleUpdate(e, team)
      handler.onTouchEnd = (e) => this.handleUpdate(e, team)
    } else {
      handler.onClick = (e) => this.handleUpdate(e, team)
    }

    return (
      <Button
        block
        disabled={disabled}
        bsStyle="primary"
        styleName={style}
        {...handler}
      >
        <span styleName={disabled ? 'text-disabled' : 'text'}>
          {disabled && ''}
          {!disabled && (
            <span>
              ({team.seed})
              <br />
              {team.name}
            </span>
          )}
        </span>
      </Button>
    )
  }

  renderButtons() {
    const { event, bracket, next: getNext } = this.props
    const { disabled } = this.state
    const nextGame = getNext({ currentMaster: bracket }, true)

    if (!nextGame) {
      return (
        <span>
          <Button
            block
            disabled={disabled}
            bsStyle="success"
            styleName="full"
            href={disabled ? null : tweetHref({ event, bracket })}
          >
            <span styleName={disabled ? 'text-disabled' : 'text'}>
              {disabled ? '' : 'Enter my Bracket!'}
            </span>
          </Button>
        </span>
      )
    }

    const [team1, team2] = shuffle(nextGame)
    return (
      <span>
        {this.renderButton(team1, 'left')}
        {this.renderButton(team2, 'right')}
      </span>
    )
  }

  renderLocked() {
    return (
      <Button block bsStyle="default" disabled styleName="full">
        This event is locked!
      </Button>
    )
  }

  render() {
    const { bracket, next, onUpdate, locked } = this.props

    if (!bracket || !next || !onUpdate) return null

    return (
      <div styleName="root">
        {locked ? this.renderLocked() : this.renderButtons()}
      </div>
    )
  }
}
