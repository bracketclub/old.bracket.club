import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import fetch from 'lib/fetchDecorator';
import mapDispatchToProps from 'lib/mapDispatchToProps';

import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';

import Page from '../components/layout/Page';
import Bracket from '../components/bracket/Bracket';
import MasterNav from '../components/connected/MasterNav';

const mapStateToProps = mapSelectorsToProps({
  bracket: mastersSelectors.bracket,
  sync: mastersSelectors.sync
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetch, props.event.id, mastersActions.sse]
});

@connect(mapStateToProps, mapDispatchToProps({mastersActions}))
@fetch(mapPropsToActions)
export default class MasterBracketPage extends Component {
  static propTypes = {
    bracket: PropTypes.object,
    sync: PropTypes.object
  };

  static getEventPath = (e, params, query) => ({pathname: `/${e}`, query});

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
