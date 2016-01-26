import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from '../lib/fetchDecorator';
import mapDispatchToProps from '../lib/mapDispatchToProps';

import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';

import Page from '../components/layout/Page';
import Bracket from '../components/bracket/Bracket';
import MasterNav from '../components/connected/MasterNav';

const mapStateToProps = (state, props) => ({
  bracket: mastersSelectors.bracket(state, props),
  sync: state.masters.sync
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetchOne, props.event.id]
});

@connect(mapStateToProps, mapDispatchToProps({mastersActions}))
@fetch(mapPropsToActions)
export default class MasterBracket extends Component {
  static propTypes = {
    bracket: PropTypes.object,
    sync: PropTypes.object
  };

  static getEventPath = (e) => e;

  render() {
    const {
      bracket,
      sync
    } = this.props;

    return (
      <Page sync={sync} width='full'>
        <MasterNav {...this.props} />
        <Bracket bracket={bracket} />
      </Page>
    );
  }
}
