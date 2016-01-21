import React, {PropTypes, Component} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {PageHeader, ListGroup, ListGroupItem} from 'react-bootstrap';

export default class Results extends Component {
  static propTypes = {
    entries: PropTypes.array.isRequired
  };

  render() {
    const {entries} = this.props;

    return (
      <div>
        <PageHeader>Results</PageHeader>
        <ListGroup>
          {entries.map((entry) =>
            <LinkContainer key={entry.data_id} to={`/${entry.sport}-${entry.year}/entries/${entry.data_id}`}>
              <ListGroupItem>
                {entry.data_id}
              </ListGroupItem>
            </LinkContainer>
          )}
        </ListGroup>
      </div>
    );
  }
}
