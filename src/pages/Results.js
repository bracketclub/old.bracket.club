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
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';

const mapStateToProps = (state, props) => ({
  entries: entriesSelectors.byEvent(state, props),
  master: mastersSelectors.bracketString(state, props),
  sync: mergeSyncState(state.entries, state.masters),
  navigation: mastersSelectors.navigation(state, props),
  progress: mastersSelectors.progress(state, props)
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
    navigation: PropTypes.object,
    progress: PropTypes.object,
    sync: PropTypes.object
  };

  static getEventPath = (e) => `${e}/entries`;

  handleNavigate = (method) => {
    this.props.dispatch(mastersActions[method]());
  };

  render() {
    const {sync, entries, master, event, navigation, progress} = this.props;

    return (
      <Page sync={sync}>
        <BracketHeader>
          <BracketNav navigation={navigation} event={event} onNavigate={this.handleNavigate} />
          <BracketProgress message='games played' progress={progress} />
        </BracketHeader>
        <ResultsList entries={entries} master={master} />
      </Page>
    );
  }
}
