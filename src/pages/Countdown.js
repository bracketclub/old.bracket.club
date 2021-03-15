import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PageHeader } from 'react-bootstrap'
import { connect } from 'react-redux'
import mapSelectorsToProps from 'lib/mapSelectorsToProps'
import displayName from 'lib/eventDisplayName'
import * as eventSelectors from '../selectors/event'
import * as bracketSelectors from '../selectors/bracket'
import Page from '../components/layout/Page'
import Countdown from '../components/event/Countdown'

const mapStateToProps = mapSelectorsToProps({
  event: eventSelectors.info,
  locks: bracketSelectors.locks,
  locked: bracketSelectors.locked,
})

@connect(mapStateToProps)
export default class CountdownPage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
  }

  render() {
    const { event, locks, locked } = this.props

    return (
      <Page>
        <PageHeader className="text-center">
          {displayName(event)} Countdown
        </PageHeader>
        <h1 className="text-center">
          <Countdown {...{ locked, locks }} />
        </h1>
      </Page>
    )
  }
}
