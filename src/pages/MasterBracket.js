import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import fetch from 'lib/fetchDecorator';
import * as mastersSelectors from '../selectors/masters';
import * as mastersActions from '../actions/masters';
import * as bracketSelectors from '../selectors/bracket';
import * as eventSelectors from '../selectors/event';
import Page from '../components/layout/Page';
import Bracket from '../components/bracket/Bracket';
import MasterNav from '../components/bracket/MasterNav';

const mapStateToProps = mapSelectorsToProps({
  bracket: mastersSelectors.bracket,
  sync: mastersSelectors.sync,
  bestOf: bracketSelectors.bestOf,
  event: eventSelectors.info
});

const mapPropsToActions = (props) => ({
  masters: [mastersActions.fetch, props.event.id]
});

@connect(mapStateToProps)
@fetch(mapPropsToActions)
export default class MasterBracketPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    bracket: PropTypes.object,
    sync: PropTypes.object,
    bestOf: PropTypes.object
  };

  render() {
    const {
      bracket,
      sync,
      bestOf,
      location
    } = this.props;

    return (
      <Page sync={sync} width='full'>
        <MasterNav location={location} />
        <Bracket bracket={bracket} bestOf={bestOf} />
      </Page>
    );
  }
}
