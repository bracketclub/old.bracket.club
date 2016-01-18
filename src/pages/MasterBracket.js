'use strict';

import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import eventSelector from '../selectors/event';
import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';

import Page from '../components/containers/Page';
import Bracket from '../components/bracket/Bracket';
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';

const mapStateToProps = (state, props) => ({
  event: eventSelector(state),
  bracket: mastersSelectors.bracket(state),
  navigation: mastersSelectors.navigation(state),
  progress: mastersSelectors.progress(state),
  sync: state.masters.sync
});

const mapDispatchToProps = (dispatch) => ({
  mastersActions: bindActionCreators(mastersActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class MasterBracket extends Component {
  static propTypes = {
    bracket: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired,
    sync: PropTypes.object.isRequired,
    mastersActions: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.mastersActions.fetchOne(this.props.event.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.event.year !== this.props.event.year) {
      this.props.mastersActions.fetchOne(nextProps.event.id);
    }
  }

  handleNavigate = (method) => {
    this.props.mastersActions[method]();
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
