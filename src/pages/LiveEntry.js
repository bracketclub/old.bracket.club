'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routeActions} from 'redux-simple-router';
import analytics from '../lib/analytics';

import eventSelector from '../selectors/event';
import * as entrySelectors from '../selectors/entry';
import * as bracketSelectors from '../selectors/bracket';
import * as entryActions from '../actions/entry';

import Page from '../components/containers/Page';
import LiveBracket from '../components/bracket/LiveBracket';
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';
import BracketEnterButton from '../components/bracket/EnterButton';

const mapStateToProps = (state, props) => ({
  // Event
  event: eventSelector(state),
  lock: bracketSelectors.lock(state),
  validate: bracketSelectors.validate(state),
  bracketHelpers: bracketSelectors.helpers(state),
  // Entry
  bracket: entrySelectors.bracketString(state),
  routeBracket: props.routeParams.bracket,
  navigation: entrySelectors.navigation(state),
  progress: entrySelectors.progress(state)
});

const mapDispatchToProps = (dispatch) => ({
  entryActions: bindActionCreators(entryActions, dispatch),
  routeActions: bindActionCreators(routeActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class LiveEntry extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    lock: PropTypes.object.isRequired,
    validate: PropTypes.func.isRequired,
    bracketHelpers: PropTypes.object.isRequired,
    bracket: PropTypes.string.isRequired,
    routeBracket: PropTypes.string,
    navigation: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired,
    entryActions: PropTypes.object.isRequired,
    routeActions: PropTypes.object.isRequired
  };

  componentDidMount() {
    if (this.props.routeBracket) {
      this.props.entryActions.pushBracket(this.props.routeBracket);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateUrl(nextProps);
  }

  updateUrl(props) {
    const pathname = `/${props.event.id}/${props.bracket}`;
    const current = props.location.pathname;
    if (current !== pathname) {
      props.routeActions.replace(pathname);
    }
  }

  handleNavigate = (method) => {
    this.props.entryActions[method]();
  };

  handleUpdate = (game) => {
    this.props.entryActions.updateGame({
      game,
      update: this.props.bracketHelpers.update,
      current: this.props.bracket
    });
  };

  handleReset = () => {
    this.props.entryActions.pushBracket(
      this.props.bracketHelpers.emptyBracket
    );
  };

  handleGenerate = (method) => {
    this.props.entryActions.generateBracket({
      method,
      generate: this.props.bracketHelpers.generate
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
      lock,
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
            lock={lock}
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
