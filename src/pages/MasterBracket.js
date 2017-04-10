import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import fetch from 'lib/fetchDecorator';
import mapDispatchToProps from 'lib/mapDispatchToProps';

import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';
import * as bracketSelectors from '../selectors/bracket';

import Page from '../components/layout/Page';
import Bracket from '../components/bracket/Bracket';
import MasterNav from '../components/connected/MasterNav';

const mapStateToProps = mapSelectorsToProps({
  bracket: mastersSelectors.bracket,
  sync: mastersSelectors.sync,
  bestOf: bracketSelectors.bestOf
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetch, props.event.id]
});

@connect(mapStateToProps, mapDispatchToProps({mastersActions}))
@fetch(mapPropsToActions)
export default class MasterBracketPage extends Component {
  static propTypes = {
    bracket: PropTypes.object,
    sync: PropTypes.object,
    bestOf: PropTypes.object
  };

  static getEventPath = (e, {params, query}) => ({pathname: `/${e}`, query});

  render() {
    const {
      bracket,
      sync,
      bestOf
    } = this.props;

    return (
      <Page sync={sync} width='full'>
        <MasterNav {...this.props} />
        <Bracket bracket={bracket} bestOf={bestOf} />
      </Page>
    );
  }
}
