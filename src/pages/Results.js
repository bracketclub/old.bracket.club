import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import fetch from 'lib/fetchDecorator';
import mergeSyncState from 'lib/mergeSyncState';
import mapDispatchToProps from 'lib/mapDispatchToProps';
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
  masters: [mastersActions.fetchOne, props.event.id, mastersActions.sse],
  entries: [entriesActions.fetchAll, props.event.id, entriesActions.sse]
});

@connect(mapStateToProps, mapDispatchToProps({entriesActions}))
@fetch(mapPropsToActions)
export default class ResultsPage extends Component {
  static propTypes = {
    entries: PropTypes.array,
    sortParams: PropTypes.object,
    sync: PropTypes.object
  };

  static getEventPath = (e, params, query) => ({pathname: `/${e}/entries`, query});

  handleSort = (key) => {
    this.props.entriesActions.sort(key);
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
