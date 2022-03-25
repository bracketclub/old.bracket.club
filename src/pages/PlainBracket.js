import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import mapDispatchToProps from 'lib/mapDispatchToProps'
import mapSelectorsToProps from 'lib/mapSelectorsToProps'
import * as bracketSelectors from '../selectors/bracket'
import * as mastersSelectors from '../selectors/masters'
import * as eventSelectors from '../selectors/event'
import * as mastersActions from '../actions/masters'
import Page from '../components/layout/Page'
import DiffBracket from '../components/bracket/DiffBracket'

const mapStateToProps = mapSelectorsToProps({
  event: eventSelectors.info,
  diff: bracketSelectors.diff,
  master: bracketSelectors.empty,
  sync: mastersSelectors.sync,
  bestOf: bracketSelectors.bestOf,
})

@connect(mapStateToProps, mapDispatchToProps({ mastersActions }))
export default class PlainBracket extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    master: PropTypes.string,
    diff: PropTypes.func,
    sync: PropTypes.object,
    bestOf: PropTypes.object,
  }

  render() {
    const {
      diff,
      master,
      sync,
      bestOf,
      event,
      match: {
        params: { bracket },
      },
    } = this.props

    return (
      <Page width="full" sync={sync} className={event.id}>
        <DiffBracket {...{ diff, entry: bracket, master, bestOf }} />
      </Page>
    )
  }
}
