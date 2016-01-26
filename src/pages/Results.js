import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from '../lib/fetchDecorator';
import mergeSyncState from '../lib/mergeSyncState';
import mapDispatchToProps from '../lib/mapDispatchToProps';

import * as entriesSelectors from '../selectors/entries';
import * as entriesActions from '../actions/entries';
import * as mastersActions from '../actions/masters';

import Page from '../components/layout/Page';
import ResultsTable from '../components/results/Table';
import MasterNav from '../components/connected/MasterNav';

const mapStateToProps = (state, props) => ({
  entries: entriesSelectors.scoredByEvent(state, props),
  sortParams: entriesSelectors.sortParams(state, props),
  sync: mergeSyncState(state.entries, state.masters)
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetchOne, props.event.id],
  entries: [entriesActions.fetchAll, props.event.id]
});

@connect(mapStateToProps, mapDispatchToProps({entriesActions}))
@fetch(mapPropsToActions)
export default class Results extends Component {
  static propTypes = {
    entries: PropTypes.array,
    sortParams: PropTypes.object,
    sync: PropTypes.object
  };

  static getEventPath = (e) => `${e}/entries`;

  handleSort = (key) => {
    const {location, sortParams} = this.props;

    this.props.entriesActions.sort({
      location,
      current: sortParams,
      sort: key
    });
  };

  render() {
    const {sync, entries, sortParams} = this.props;

    return (
      <Page sync={sync}>
        <MasterNav {...this.props} />
        <ResultsTable
          sortParams={sortParams}
          onSort={this.handleSort}
          entries={entries}
        />
      </Page>
    );
  }
}
