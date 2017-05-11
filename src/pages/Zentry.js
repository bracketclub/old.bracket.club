import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import * as eventSelectors from '../selectors/event';
import * as entrySelectors from '../selectors/entry';
import * as bracketSelectors from '../selectors/bracket';
import * as entryActionCreators from '../actions/entry';
import ZenBracket from '../components/bracket/Zen';
import Page from '../components/layout/Page';

const mapStateToProps = mapSelectorsToProps({
  next: bracketSelectors.next,
  bracket: entrySelectors.bracketString,
  empty: bracketSelectors.empty,
  navigation: entrySelectors.navigation,
  progress: entrySelectors.progress,
  event: eventSelectors.info,
  locked: bracketSelectors.locked
});

@connect(mapStateToProps, mapDispatchToProps({entryActions: entryActionCreators}))
export default class ZentryPage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    locked: PropTypes.bool.isRequired,
    next: PropTypes.func,
    bracket: PropTypes.string
  };

  render() {
    const {
      bracket,
      next,
      entryActions,
      event,
      locked
    } = this.props;

    return (
      <Page width='full'>
        <ZenBracket
          event={event}
          next={next}
          bracket={bracket}
          locked={locked}
          onUpdate={(game) => entryActions.update(game, false)}
        />
      </Page>
    );
  }
}
