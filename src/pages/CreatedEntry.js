import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import fetch from 'lib/fetchDecorator';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import * as bracketSelectors from '../selectors/bracket';
import * as mastersSelectors from '../selectors/masters';
import * as eventSelectors from '../selectors/event';
import * as mastersActions from '../actions/masters';
import Page from '../components/layout/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import MasterNav from '../components/bracket/MasterNav';

const mapStateToProps = mapSelectorsToProps({
  event: eventSelectors.info,
  diff: bracketSelectors.diff,
  master: mastersSelectors.bracketString,
  sync: mastersSelectors.sync,
  bestOf: bracketSelectors.bestOf
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetch, props.event.id]
});

@connect(mapStateToProps, mapDispatchToProps({mastersActions}))
@fetch(mapPropsToActions)
export default class CreatedEntryPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    master: PropTypes.string,
    diff: PropTypes.func,
    sync: PropTypes.object,
    bestOf: PropTypes.object
  };

  render() {
    const {
      diff,
      master,
      sync,
      bestOf,
      location,
      match: {params: {bracket}}
    } = this.props;

    return (
      <Page width='full' sync={sync}>
        <MasterNav location={location} />
        <DiffBracket {...{diff, entry: bracket, master, bestOf}} />
      </Page>
    );
  }
}
