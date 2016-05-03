import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import fetch from 'lib/fetchDecorator';
import mergeSyncState from 'lib/mergeSyncState';
import mapDispatchToProps from 'lib/mapDispatchToProps';

import * as entriesSelectors from '../selectors/entries';
import * as mastersSelectors from '../selectors/masters';
import * as bracketSelectors from '../selectors/bracket';
import * as meSelectors from '../selectors/me';
import * as entriesActions from '../actions/entries';
import * as mastersActions from '../actions/masters';
import * as canWinActions from '../actions/canWin';
import * as meActions from '../actions/me';

import Page from '../components/layout/Page';
import ResultsTable from '../components/results/Table';
import MasterNav from '../components/connected/MasterNav';

const isFriends = (pathname) => pathname.indexOf('/friends') > -1;

const mapStateToProps = (state, props) => {
  const entriesSelector = isFriends(props.location.pathname)
    ? entriesSelectors.friendsScoredByEvent
    : entriesSelectors.scoredByEvent;
  return {
    progress: mastersSelectors.progress(state, props),
    entries: entriesSelector(state, props),
    columns: bracketSelectors.columns(state, props),
    sortParams: entriesSelectors.sortParams(state, props),
    sync: mergeSyncState(entriesSelectors, mastersSelectors, meSelectors)(state, props)
  };
};

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetch, props.event.id, mastersActions.sse],
  entries: [entriesActions.fetch, props.event.id, entriesActions.sse]
});

@connect(mapStateToProps, mapDispatchToProps({entriesActions, canWinActions}))
@fetch(mapPropsToActions)
export default class ResultsPage extends Component {
  static propTypes = {
    entries: PropTypes.array,
    sortParams: PropTypes.object,
    sync: PropTypes.object,
    progress: PropTypes.object,
    columns: PropTypes.array
  };

  static getEventPath = (e, {query, pathname}) => ({
    pathname: `/${e}/entries${isFriends(pathname) ? '/friends' : ''}`,
    query
  });

  componentDidMount() {
    this.fetchFriends();
  }

  componentDidUpdate(prevProps) {
    const {pathname} = this.props.location;
    const {pathname: previous} = prevProps.location;

    if (pathname !== previous) {
      this.fetchFriends();
    }
  }

  fetchFriends() {
    if (this.isFriends()) {
      this.props.dispatch(meActions.getFriends());
    }
  }

  isFriends() {
    return isFriends(this.props.location.pathname);
  }

  handleSort = (key) => {
    this.props.entriesActions.sort(key);
  };

  handleCanWinCheck = (options) => {
    this.props.canWinActions.canWin(options);
  };

  render() {
    const {sync, entries, sortParams, event, locked, locks, progress, columns} = this.props;

    return (
      <Page sync={sync}>
        <MasterNav {...this.props} />
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
    );
  }
}
