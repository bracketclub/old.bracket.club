import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import mapDispatchToProps from 'lib/mapDispatchToProps'
import mapSelectorsToProps from 'lib/mapSelectorsToProps'
import * as bracketSelectors from '../../selectors/bracket'
import * as mastersSelectors from '../../selectors/masters'
import * as eventSelectors from '../../selectors/event'
import * as mastersActions from '../../actions/masters'
import BracketNav from './Nav'
import BracketProgress from './Progress'
import BracketHeader from './Header'
import LockMessage from './LockMessage'

const mapStateToProps = mapSelectorsToProps({
  navigation: mastersSelectors.navigation,
  progress: mastersSelectors.progress,
  locked: bracketSelectors.locked,
  locks: bracketSelectors.locks,
  event: eventSelectors.info,
})

@withRouter
@connect(mapStateToProps, mapDispatchToProps({ mastersActions }))
export default class MasterNav extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types, (gets used by selectors)
    location: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    user: PropTypes.object,
  }

  handleNavigate = (method) => {
    this.props.mastersActions.navigate(method)
  }

  render() {
    const { navigation, progress, locked, locks, event, user } = this.props

    return [
      <BracketHeader key="bracket-header">
        <BracketNav navigation={navigation} onNavigate={this.handleNavigate} />
        <BracketProgress message="played" progress={progress} />
      </BracketHeader>,
      <LockMessage
        key="lock-message"
        locked={locked}
        locks={locks}
        event={event}
        user={user}
      />,
    ]
  }
}
