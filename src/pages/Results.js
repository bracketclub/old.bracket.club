'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import mergeSyncState from '../lib/mergeSyncState';
import eventSelector from '../selectors/event';
import * as mastersSelectors from '../selectors/masters';
import * as entriesSelectors from '../selectors/entries';
import * as entryActions from '../actions/entries';
import * as mastersActions from '../actions/masters';

import Page from '../components/containers/Page';
import ResultsList from '../components/results/Results';

const mapStateToProps = (state, props) => ({
  entries: entriesSelectors.byEvent(state),
  master: mastersSelectors.bracketString(state),
  event: eventSelector(state),
  sync: mergeSyncState(state.entries, state.masters)
});

const mapDispatchToProps = (dispatch) => ({
  entryActions: bindActionCreators(entryActions, dispatch),
  mastersActions: bindActionCreators(mastersActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Results extends Component {
  static propTypes = {
    entries: PropTypes.array,
    master: PropTypes.string,
    event: PropTypes.object,
    sync: PropTypes.object,
    mastersActions: PropTypes.object,
    entryActions: PropTypes.object
  };

  static getEventPath = (e) => `${e}/entries`;

  componentDidMount() {
    this.props.mastersActions.fetchOne(this.props.event.id);
    this.props.entryActions.fetchAll(this.props.event.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.event.id !== this.props.event.id) {
      this.props.mastersActions.fetchOne(nextProps.event.id);
      this.props.entryActions.fetchAll(nextProps.event.id);
    }
  }

  render() {
    const {sync, entries, master} = this.props;

    return (
      <Page sync={sync}>
        <ResultsList entries={entries} master={master} />
      </Page>
    );
  }
}
