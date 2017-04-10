import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import fetch from 'lib/fetchDecorator';
import mergeSyncState from 'lib/mergeSyncState';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';

import * as mastersActions from '../actions/masters';
import * as bracketSelectors from '../selectors/bracket';
import * as usersSelectors from '../selectors/users';
import * as mastersSelectors from '../selectors/masters';
import * as entriesSelectors from '../selectors/entries';
import * as entriesActions from '../actions/entries';
import * as usersActions from '../actions/users';

import Page from '../components/layout/Page';
import MasterNav from '../components/connected/MasterNav';
import UserInfo from '../components/user/Info';
import UserEntry from '../components/user/Entry';
import ScoreCard from '../components/user/ScoreCard';

const mapStateToProps = mapSelectorsToProps({
  diff: bracketSelectors.diff,
  bestOf: bracketSelectors.bestOf,
  master: mastersSelectors.bracketString,
  user: usersSelectors.userWithRankedEntry,
  sync: mergeSyncState(usersSelectors.eventSync, entriesSelectors, mastersSelectors)
});

const mapPropsToActions = (props) => ({
  user: [usersActions.fetch, `${props.params.userId}/${props.event.id}`, usersActions.sse],
  entries: [entriesActions.fetch, props.event.id],
  masters: [mastersActions.fetch, props.event.id]
});

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class UserEntryPage extends Component {
  static propTypes = {
    diff: PropTypes.func,
    user: PropTypes.object,
    master: PropTypes.string,
    sync: PropTypes.object,
    bestOf: PropTypes.object
  };

  static getEventPath = (e, {params, query}) => ({pathname: `/${e}/entries/${params.userId}`, query});

  render() {
    const {
      sync,
      user,
      master,
      diff,
      bestOf
    } = this.props;

    return (
      <Page sync={sync} width='full'>
        <MasterNav {...this.props} />
        <UserInfo user={user} />
        <ScoreCard score={user.score} />
        <UserEntry user={user} diff={diff} master={master} bestOf={bestOf} />
      </Page>
    );
  }
}
