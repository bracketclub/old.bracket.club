import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import fetch from 'lib/fetchDecorator'
import mergeSyncState from 'lib/mergeSyncState'
import mapDispatchToProps from 'lib/mapDispatchToProps'
import * as entriesSelectors from '../selectors/entries'
import * as mastersSelectors from '../selectors/masters'
import * as bracketSelectors from '../selectors/bracket'
import * as eventSelectors from '../selectors/event'
import * as meSelectors from '../selectors/me'
import * as entriesActions from '../actions/entries'
import * as mastersActions from '../actions/masters'
import * as canWinActions from '../actions/canWin'
import * as meActions from '../actions/me'
import Page from '../components/layout/Page'
import ResultsTable from '../components/results/Table'
import MasterNav from '../components/bracket/MasterNav'

const isFriends = (pathname) => pathname.indexOf('/friends') > -1

const mapStateToProps = (state, props) => {
  const entriesSelector = isFriends(props.location.pathname)
    ? entriesSelectors.friendsScoredByEvent
    : entriesSelectors.scoredByEvent
  return {
    locked: bracketSelectors.locked(state, props),
    locks: bracketSelectors.locks(state, props),
    event: eventSelectors.info(state, props),
    progress: mastersSelectors.progress(state, props),
    entries: entriesSelector(state, props),
    columns: bracketSelectors.columns(state, props),
    sortParams: entriesSelectors.sortParams(state, props),
    sync: mergeSyncState(
      entriesSelectors,
      mastersSelectors,
      meSelectors
    )(state, props),
  }
}

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetch, props.event.id],
  entries: [entriesActions.fetch, props.event.id],
})

@connect(mapStateToProps, mapDispatchToProps({ entriesActions, canWinActions }))
@fetch(mapPropsToActions)
export default class ResultsPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    entries: PropTypes.array,
    sortParams: PropTypes.object,
    sync: PropTypes.object,
    progress: PropTypes.object,
    columns: PropTypes.array,
  }

  componentDidMount() {
    this.fetchFriends()
  }

  componentDidUpdate(prevProps) {
    const { pathname } = this.props.location
    const { pathname: previous } = prevProps.location

    if (pathname !== previous) {
      this.fetchFriends()
    }
  }

  fetchFriends() {
    if (this.isFriends()) {
      this.props.dispatch(meActions.getFriends())
    }
  }

  isFriends() {
    return isFriends(this.props.location.pathname)
  }

  handleSort = (key) => {
    this.props.entriesActions.sort(key)
  }

  handleCanWinCheck = (options) => {
    this.props.canWinActions.canWin(options)
  }

  render() {
    const {
      sync,
      entries,
      sortParams,
      event,
      locked,
      locks,
      progress,
      columns,
      location,
    } = this.props

    const meEntry = entries.find((e) => e.isMe)

    return (
      <Page sync={sync}>
        <MasterNav
          location={location}
          isMe={!!meEntry}
          bracket={meEntry && meEntry.bracket}
        />
        <ResultsTable
          sortParams={sortParams}
          onSort={this.handleSort}
          onCanWinCheck={this.handleCanWinCheck}
          entries={entries}
          event={event}
          locked={locked}
          locks={locks}
          progress={progress}
          columns={columns}
          friends={this.isFriends()}
        />
      </Page>
    )
  }
}
