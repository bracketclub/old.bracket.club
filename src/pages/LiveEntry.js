import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import * as entrySelectors from '../selectors/entry';
import * as bracketSelectors from '../selectors/bracket';
import * as eventSelectors from '../selectors/event';
import * as entryActionCreators from '../actions/entry';
import Page from '../components/layout/Page';
import LiveBracket from '../components/bracket/LiveBracket';
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';
import BracketEnterButton from '../components/bracket/EnterButton';

const mapStateToProps = mapSelectorsToProps({
  validate: bracketSelectors.validate,
  bracket: entrySelectors.bracketString,
  empty: bracketSelectors.empty,
  finalId: bracketSelectors.finalId,
  navigation: entrySelectors.navigation,
  progress: entrySelectors.progress,
  bestOf: bracketSelectors.bestOf,
  locked: bracketSelectors.locked,
  locks: bracketSelectors.locks,
  event: eventSelectors.info
});

@connect(mapStateToProps, mapDispatchToProps({entryActions: entryActionCreators}))
export default class LiveEntryPage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    validate: PropTypes.func,
    bracket: PropTypes.string,
    empty: PropTypes.string,
    finalId: PropTypes.string,
    navigation: PropTypes.object,
    progress: PropTypes.object,
    bestOf: PropTypes.object
  };

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
    const {bracket: bracketParam} = this.props.match.params;

    if (bracketParam && bracketParam !== bracket && bracketParam !== empty) {
      this.props.entryActions.pushBracket(bracketParam);
    }
  }

  updatePath() {
    const {bracket, empty} = this.props;
    const {bracket: bracketParam} = this.props.match.params;

    if (bracket && bracket !== bracketParam && bracket !== empty) {
      this.props.entryActions.updatePath(bracket);
    }
  }

  render() {
    const {
      navigation,
      event,
      progress,
      locks,
      locked,
      bracket,
      validate,
      entryActions,
      finalId,
      bestOf
    } = this.props;

    return (
      <Page width='full' className={event.id}>
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
            locks={locks}
            locked={locked}
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
          finalId={finalId}
          bestOf={bestOf}
          onUpdate={entryActions.update}
        />
      </Page>
    );
  }
}
