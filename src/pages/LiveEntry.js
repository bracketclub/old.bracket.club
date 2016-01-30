import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {routeActions} from 'redux-simple-router';
import analytics from '../lib/analytics';
import mapDispatchToProps from '../lib/mapDispatchToProps';

import * as entrySelectors from '../selectors/entry';
import * as bracketSelectors from '../selectors/bracket';
import * as entryActions from '../actions/entry';

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

@connect(mapStateToProps, mapDispatchToProps({entryActions, routeActions}))
export default class LiveEntryPage extends Component {
  static propTypes = {
    validate: PropTypes.func,
    bracketHelpers: PropTypes.object,
    bracket: PropTypes.string,
    navigation: PropTypes.object,
    progress: PropTypes.object
  };

  static getEventPath = (e) => ({pathname: `/${e}`});

  componentDidMount() {
    if (this.props.params.routeBracket) {
      this.props.entryActions.pushBracket(this.props.params.routeBracket);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.event.id === this.props.event.id) {
      this.updateUrl();
    }
  }

  updateUrl() {
    const {event, bracket, location, locked} = this.props;
    const pathname = `/${event.id}/${bracket}`;
    const current = location.pathname;
    if (!locked && current !== pathname) {
      this.props.routeActions.replace(pathname);
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
