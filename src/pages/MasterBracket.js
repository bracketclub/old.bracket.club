import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from '../lib/fetchDecorator';

import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';

import Page from '../components/containers/Page';
import Bracket from '../components/bracket/Bracket';
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';

const mapStateToProps = (state, props) => ({
  bracket: mastersSelectors.bracket(state, props),
  navigation: mastersSelectors.navigation(state, props),
  progress: mastersSelectors.progress(state, props),
  sync: state.masters.sync
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetchOne, props.event.id]
});

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class MasterBracket extends Component {
  static propTypes = {
    bracket: PropTypes.object,
    navigation: PropTypes.object,
    progress: PropTypes.object,
    sync: PropTypes.object
  };

  static getEventPath = (e) => e;

  handleNavigate = (method) => {
    this.props.dispatch(mastersActions[method]());
  };

  render() {
    const {
      bracket,
      event,
      navigation,
      progress,
      sync
    } = this.props;

    return (
      <Page sync={sync} width='full'>
        <BracketHeader>
          <BracketNav navigation={navigation} event={event} onNavigate={this.handleNavigate} />
          <BracketProgress message='games played' progress={progress} />
        </BracketHeader>
        <Bracket bracket={bracket} />
      </Page>
    );
  }
}
