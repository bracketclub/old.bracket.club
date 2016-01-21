import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import eventSelector from '../selectors/event';
import * as bracketSelectors from '../selectors/bracket';
import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';

import Page from '../components/containers/Page';
import DiffBracket from '../components/bracket/DiffBracket';
import LockMessage from '../components/bracket/LockMessage';

const mapStateToProps = (state, props) => ({
  event: eventSelector(state),
  lock: bracketSelectors.lock(state),
  diff: bracketSelectors.diff(state),
  master: mastersSelectors.bracketString(state),
  entry: props.routeParams.bracket,
  sync: state.masters.sync
});

const mapDispatchToProps = (dispatch) => ({
  mastersActions: bindActionCreators(mastersActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class CreatedEntry extends Component {
  static propTypes = {
    entry: PropTypes.string.isRequired,
    diff: PropTypes.func.isRequired,
    master: PropTypes.string.isRequired,
    event: PropTypes.object.isRequired,
    lock: PropTypes.object.isRequired,
    sync: PropTypes.object.isRequired
  };

  fetchData(props) {
    props.mastersActions.fetchOne(props.event.id);
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.event.id !== this.props.event.id) {
      this.fetchData(nextProps);
    }
  }

  render() {
    const {
      entry,
      diff,
      master,
      event,
      lock,
      sync
    } = this.props;

    return (
      <Page width='full' sync={sync}>
        <LockMessage lock={lock} event={event} />
        <DiffBracket {...{diff, entry, master}} />
      </Page>
    );
  }
}
