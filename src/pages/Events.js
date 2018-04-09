import config from 'config';
import {groupBy} from 'lodash';
import React, {Component} from 'react';
import {PageHeader, ListGroup, ListGroupItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import eventDisplayName, {parse as parseEvent, sport as displaySport} from 'lib/eventDisplayName';
import * as eventSelectors from '../selectors/event';
import Page from '../components/layout/Page';

const eventsBySport = groupBy(config.events.map(parseEvent), 'sport');
const sports = Object.keys(eventsBySport);

export default class EventsPAge extends Component {
  render() {
    return (
      <Page>
        <PageHeader>Events</PageHeader>
        {sports.map((sport) => (
          <React.Fragment key={sport}>
            <h2>{displaySport(sport)}</h2>
            <ListGroup>
              {eventsBySport[sport].map((event) => (
                <LinkContainer key={eventSelectors.id({event})} to={`/${eventSelectors.id({event})}`}>
                  <ListGroupItem>{eventDisplayName(event)}</ListGroupItem>
                </LinkContainer>
              ))}
            </ListGroup>
          </React.Fragment>
        ))}
      </Page>
    );
  }
}
