import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from '../lib/fetchDecorator';

import * as bracketSelectors from '../selectors/bracket';
import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';

import Page from '../components/containers/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';
import LockMessage from '../components/bracket/LockMessage';

const mapStateToProps = (state, props) => ({
  diff: bracketSelectors.diff(state, props),
  master: mastersSelectors.bracketString(state, props),
  navigation: mastersSelectors.navigation(state, props),
  progress: mastersSelectors.progress(state, props),
  sync: state.masters.sync
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetchOne, props.event.id]
});

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class CreatedEntry extends Component {
  static propTypes = {
    master: PropTypes.string,
    entry: PropTypes.string,
    diff: PropTypes.func,
    sync: PropTypes.object,
    navigation: PropTypes.object,
    progress: PropTypes.object
  };

  static getEventPath = (e) => e;

  render() {
    const {
      diff,
      master,
      event,
      locks,
      locked,
      sync,
      navigation,
      progress
    } = this.props;

    const {bracket} = this.props.params;

    return (
      <Page width='full' sync={sync}>
        <BracketHeader>
          <BracketNav navigation={navigation} event={event} onNavigate={this.handleNavigate} />
          <BracketProgress message='games played' progress={progress} />
        </BracketHeader>
        <LockMessage locked={locked} locks={locks} event={event} />
        <DiffBracket {...{diff, entry: bracket, master}} />
      </Page>
    );
  }
}
