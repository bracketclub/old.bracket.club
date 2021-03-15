import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import fetch from 'lib/fetchDecorator'
import mergeSyncState from 'lib/mergeSyncState'
import mapSelectorsToProps from 'lib/mapSelectorsToProps'
import * as mastersActions from '../actions/masters'
import * as bracketSelectors from '../selectors/bracket'
import * as usersSelectors from '../selectors/users'
import * as mastersSelectors from '../selectors/masters'
import * as entriesSelectors from '../selectors/entries'
import * as eventSelectors from '../selectors/event'
import * as entriesActions from '../actions/entries'
import * as usersActions from '../actions/users'
import Page from '../components/layout/Page'
import MasterNav from '../components/bracket/MasterNav'
import UserInfo from '../components/user/Info'
import UserEntry from '../components/user/Entry'
import ScoreCard from '../components/user/ScoreCard'

const mapStateToProps = mapSelectorsToProps({
  event: eventSelectors.info,
  diff: bracketSelectors.diff,
  bestOf: bracketSelectors.bestOf,
  master: mastersSelectors.bracketString,
  user: usersSelectors.userWithRankedEntry,
  sync: mergeSyncState(
    usersSelectors.eventSync,
    entriesSelectors,
    mastersSelectors
  ),
})

const mapPropsToActions = (props) => ({
  user: [
    usersActions.fetch,
    `${props.match.params.userId}/${props.event.id}`,
    usersActions.sse,
  ],
  entries: [entriesActions.fetch, props.event.id],
  masters: [mastersActions.fetch, props.event.id],
})

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class UserEntryPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    diff: PropTypes.func,
    user: PropTypes.object,
    master: PropTypes.string,
    sync: PropTypes.object,
    bestOf: PropTypes.object,
  }

  render() {
    const { sync, user, master, diff, bestOf, location, event } = this.props

    return (
      <Page sync={sync} width="full" className={event.id}>
        <MasterNav
          location={location}
          isMe={user && user.isMe}
          bracket={user && user.entry && user.entry.bracket}
        />
        <UserInfo user={user} />
        <ScoreCard score={user.score} />
        <UserEntry user={user} diff={diff} master={master} bestOf={bestOf} />
      </Page>
    )
  }
}
