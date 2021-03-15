import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import styles from './index.less'

export default class Team extends Component {
  static propTypes = {
    className: PropTypes.string,
    seed: PropTypes.number,
    name: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
  }

  render() {
    const { className, seed, name, children, onClick } = this.props

    const renderedChildren = [
      seed && (
        <span key="seed" className={styles.seed}>
          {seed}
        </span>
      ),
      name && (
        <span key="name" className={styles.name}>
          {name}
        </span>
      ),
      children,
    ].filter(Boolean)

    if (!renderedChildren.length) {
      return <div className={styles.team} children={'\u00A0'} />
    }

    return React.createElement(
      onClick ? 'a' : 'div',
      {
        onClick,
        className: cx(styles.team, className),
        title: name || null,
      },
      renderedChildren
    )
  }
}
