import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'

const formatter = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''}`

export default class LockMessage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    isMe: PropTypes.bool,
    bracket: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = { visible: true }
  }

  hideAlert = () => {
    this.setState({ visible: false })
  }

  renderMessage() {
    const { event, locks, isMe, bracket } = this.props

    if (isMe) {
      return (
        <span>
          <strong>Want to edit your entry?</strong> Entries are still open for
          the <strong>{event.display} Bracket</strong> for{' '}
          <TimeAgo formatter={formatter} date={locks} />.
          <br className="visible-lg-block" /> Go to{' '}
          <Link to={`/${event.id}/${bracket}`}>your entry page</Link> to make
          any changes you want and tweet your bracket again to update your
          entry.
        </span>
      )
    }

    return (
      <span>
        Entries are still open for the <strong>{event.display} Bracket</strong>{' '}
        for <TimeAgo formatter={formatter} date={locks} />.
        <br className="visible-lg-block" /> Go to the{' '}
        <Link to={`/${event.id}`}>entry page</Link>
        {bracket ? (
          <span>
            {' '}
            or <Link to={`/${event.id}/${bracket}`}>remix this entry</Link>
          </span>
        ) : (
          ''
        )}{' '}
        to fill out your bracket before it’s too late!
      </span>
    )
  }

  render() {
    const { locked } = this.props

    const { visible } = this.state

    if (locked || !visible) {
      return null
    }

    return (
      <Alert
        className="margin-collapse mt1 text-center"
        bsStyle="info"
        onDismiss={this.hideAlert}
      >
        {this.renderMessage()}
      </Alert>
    )
  }
}
