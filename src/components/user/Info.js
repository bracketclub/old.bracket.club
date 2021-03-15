import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { PageHeader } from 'react-bootstrap'
import twitterLogo from '../../../public/twitter.png'

export default class UserInfo extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  static defaultProps = {
    user: {},
  }

  render() {
    const { user } = this.props

    return (
      <PageHeader>
        <Link to={`/users/${user.id}`}>{user.username}</Link>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="twitter"
          href={`https://twitter.com/${user.username}`}
        >
          <img src={twitterLogo} />
        </a>
      </PageHeader>
    )
  }
}
