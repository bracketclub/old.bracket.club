import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from '../lib/fetchDecorator';
import mapDispatchToProps from '../lib/mapDispatchToProps';

import * as bracketSelectors from '../selectors/bracket';
import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';

import Page from '../components/containers/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import MasterNav from '../components/connected/MasterNav';
import LockMessage from '../components/bracket/LockMessage';

const mapStateToProps = (state, props) => ({
  diff: bracketSelectors.diff(state, props),
  master: mastersSelectors.bracketString(state, props),
  sync: state.masters.sync
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetchOne, props.event.id]
});

@connect(mapStateToProps, mapDispatchToProps({mastersActions}))
@fetch(mapPropsToActions)
export default class CreatedEntry extends Component {
  static propTypes = {
    master: PropTypes.string,
    entry: PropTypes.string,
    diff: PropTypes.func,
    sync: PropTypes.object
  };

  static getEventPath = (e) => e;

  render() {
    const {
      diff,
      master,
      event,
      locks,
      locked,
      sync
    } = this.props;

    const {bracket} = this.props.params;

    return (
      <Page width='full' sync={sync}>
        <MasterNav location={this.props.location} />
        <LockMessage locked={locked} locks={locks} event={event} />
        <DiffBracket {...{diff, entry: bracket, master}} />
      </Page>
    );
  }
}
