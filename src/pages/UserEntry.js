import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from '../lib/fetchDecorator';
import mergeSyncState from '../lib/mergeSyncState';

import * as entriesActions from '../actions/entries';
import * as mastersActions from '../actions/masters';
import * as bracketSelectors from '../selectors/bracket';
import * as entriesSelectors from '../selectors/entries';
import * as mastersSelectors from '../selectors/masters';

import Page from '../components/containers/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import MasterNav from '../components/connected/MasterNav';
import UserInfo from '../components/user/Info';

const mapStateToProps = (state, props) => ({
  diff: bracketSelectors.diff(state, props),
  master: mastersSelectors.bracketString(state, props),
  entry: entriesSelectors.currentWithUser(state, props),
  sync: mergeSyncState(state.entries, state.masters)
});

const mapPropsToActions = (props) => ({
  entries: [entriesActions.fetchOne, props.params.entryId],
  masters: [mastersActions.fetchOne, props.event.id]
});

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class UserEntry extends Component {
  static propTypes = {
    diff: PropTypes.func,
    entry: PropTypes.object,
    master: PropTypes.string,
    sync: PropTypes.object
  };

  static getEventPath = (e, params) => `${e}/users/${params.userId}`;

  render() {
    const {
      sync,
      entry,
      master,
      diff
    } = this.props;

    return (
      <Page sync={sync} width='full'>
        <MasterNav {...this.props} />
        <UserInfo user={entry.user} />
        <DiffBracket {...{diff, entry: entry.bracket, master}} />
      </Page>
    );
  }
}
