import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from '../lib/fetchDecorator';
import mergeSyncState from '../lib/mergeSyncState';

import * as mastersSelectors from '../selectors/masters';
import * as entriesSelectors from '../selectors/entries';
import * as entriesActions from '../actions/entries';
import * as mastersActions from '../actions/masters';

import Page from '../components/containers/Page';
import ResultsList from '../components/results/Results';
import MasterNav from '../components/connected/MasterNav';

const mapStateToProps = (state, props) => ({
  entries: entriesSelectors.byEvent(state, props),
  master: mastersSelectors.bracketString(state, props),
  sync: mergeSyncState(state.entries, state.masters)
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetchOne, props.event.id],
  entries: [entriesActions.fetchAll, props.event.id]
});

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class Results extends Component {
  static propTypes = {
    entries: PropTypes.array,
    master: PropTypes.string,
    sync: PropTypes.object
  };

  static getEventPath = (e) => `${e}/entries`;

  render() {
    const {sync, entries, master} = this.props;

    return (
      <Page sync={sync}>
        <MasterNav location={this.props.location} />
        <ResultsList entries={entries} master={master} />
      </Page>
    );
  }
}
