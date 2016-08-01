import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {event as aEvent} from 'lib/analytics';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';

import * as entrySelectors from '../selectors/entry';
import * as bracketSelectors from '../selectors/bracket';
import * as entryActionCreators from '../actions/entry';

import Page from '../components/layout/Page';
import LiveBracket from '../components/bracket/LiveBracket';
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';
import BracketEnterButton from '../components/bracket/EnterButton';
import MockMessage from '../components/bracket/MockMessage';

const mapStateToProps = mapSelectorsToProps({
  validate: bracketSelectors.validate,
  bracket: entrySelectors.bracketString,
  empty: bracketSelectors.empty,
  finalId: bracketSelectors.finalId,
  navigation: entrySelectors.navigation,
  progress: entrySelectors.progress
});

@connect(mapStateToProps, mapDispatchToProps({entryActions: entryActionCreators}))
export default class LiveEntryPage extends Component {
  static propTypes = {
    validate: PropTypes.func,
    bracket: PropTypes.string,
    empty: PropTypes.string,
    finalId: PropTypes.string,
    navigation: PropTypes.object,
    progress: PropTypes.object
  };

  static getEventPath = (e) => ({pathname: `/${e}`});

  componentDidMount() {
    // Mounting with a url bracket means that
    // bracket needs to be added to the store
    this.pushBracket();
    // Or the bracket in the store might need
    // to be synced to the url on mount
    this.updatePath();
  }

  componentDidUpdate(prevProps) {
    // Changing events means that the url needs to be
    // synced with the store if there is an entry need to sync the
    if (prevProps.event.id !== this.props.event.id) {
      this.updatePath();
    }
  }

  pushBracket() {
    const {bracket, empty} = this.props;
    const {bracket: bracketParam} = this.props.params;

    if (bracketParam && bracketParam !== bracket && bracketParam !== empty) {
      this.props.entryActions.pushBracket(bracketParam);
    }
  }

  updatePath() {
    const {bracket, empty} = this.props;
    const {bracket: bracketParam} = this.props.params;

    if (bracket && bracket !== bracketParam && bracket !== empty) {
      this.props.entryActions.updatePath(bracket);
    }
  }

  handleEnter = (bracket) => {
    aEvent({
      event: this.props.event,
      category: 'Entry',
      action: 'tweet',
      label: bracket
    });
  };

  render() {
    const {
      navigation,
      event,
      progress,
      locks,
      mocked,
      locked,
      bracket,
      validate,
      entryActions,
      finalId
    } = this.props;

    return (
      <Page width='full'>
        <BracketHeader>
          <BracketNav
            navigation={navigation}
            event={event}
            onNavigate={entryActions.navigate}
            onGenerate={entryActions.generate}
            onReset={entryActions.reset}
          />
          <BracketEnterButton
            event={event}
            bracket={bracket}
            onEnter={this.handleEnter}
            locks={locks}
            locked={locked}
            mocked={mocked}
            progress={progress}
          />
          <BracketProgress
            message='picks made'
            progress={progress}
          />
        </BracketHeader>
        <MockMessage mocked={mocked} locks={locks} />
        <LiveBracket
          validate={validate}
          bracket={bracket}
          finalId={finalId}
          onUpdate={entryActions.update}
        />
      </Page>
    );
  }
}
