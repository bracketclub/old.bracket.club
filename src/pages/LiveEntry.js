import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {routeActions} from 'redux-simple-router';
import analytics from '../lib/analytics';
import mapDispatchToProps from '../lib/mapDispatchToProps';

import * as entrySelectors from '../selectors/entry';
import * as bracketSelectors from '../selectors/bracket';
import * as entryActionCreators from '../actions/entry';

import Page from '../components/layout/Page';
import LiveBracket from '../components/bracket/LiveBracket';
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';
import BracketEnterButton from '../components/bracket/EnterButton';

const mapStateToProps = (state, props) => ({
  validate: bracketSelectors.validate(state, props),
  bracketHelpers: bracketSelectors.helpers(state, props),
  bracket: entrySelectors.bracketString(state, props),
  navigation: entrySelectors.navigation(state, props),
  progress: entrySelectors.progress(state, props)
});

@connect(mapStateToProps, mapDispatchToProps({entryActions: entryActionCreators, routeActions}))
export default class LiveEntryPage extends Component {
  static propTypes = {
    validate: PropTypes.func,
    bracketHelpers: PropTypes.object,
    bracket: PropTypes.string,
    navigation: PropTypes.object,
    progress: PropTypes.object
  };

  static getEventPath = (e) => ({pathname: `/${e}`});

  handleNavigate = (method) => {
    this.props.entryActions[method]();
  };

  handleUpdate = (game) => {
    const {entryActions, location, event, bracket, bracketHelpers} = this.props;
    entryActions.updateGame({
      location,
      event,
      current: bracket,
      update: bracketHelpers.update
    });
  };

  handleReset = () => {
    const {event, location, entryActions, bracketHelpers} = this.props;
    entryActions.pushBracket({
      event,
      location,
      bracket: bracketHelpers.emptyBracket
    });
  };

  handleGenerate = (method) => {
    const {entryActions, bracketHelpers, event, location} = this.props;
    entryActions.generateBracket({
      event,
      location,
      method,
      generate: bracketHelpers.generate
    });
  };

  handleEnter = (bracket) => {
    analytics.enterBracket(bracket);
  };

  render() {
    const {
      navigation,
      event,
      progress,
      locks,
      bracket,
      validate
    } = this.props;

    return (
      <Page width='full'>
        <BracketHeader>
          <BracketNav
            navigation={navigation}
            event={event}
            onNavigate={this.handleNavigate}
            onGenerate={this.handleGenerate}
            onReset={this.handleReset}
          />
          <BracketEnterButton
            event={event}
            bracket={bracket}
            onEnter={this.handleEnter}
            locks={locks}
            progress={progress}
          />
          <BracketProgress
            message='picks made'
            progress={progress}
          />
        </BracketHeader>
        <LiveBracket
          validate={validate}
          bracket={bracket}
          onUpdate={this.handleUpdate}
        />
      </Page>
    );
  }
}
