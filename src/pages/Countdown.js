import React, {Component} from 'react';
import {PageHeader} from 'react-bootstrap';

import displayName from 'lib/eventDisplayName';
import Page from '../components/layout/Page';
import Countdown from '../components/event/Countdown';

export default class CountdownPage extends Component {
  static getEventPath = (e) => ({pathname: `/${e}/countdown`});

  render() {
    const {event, locks, locked} = this.props;

    return (
      <Page>
        <PageHeader className='text-center'>{displayName(event)} Countdown</PageHeader>
        <h1 className='text-center'>
          <Countdown {...{locked, locks}} />
        </h1>
      </Page>
    );
  }
}
