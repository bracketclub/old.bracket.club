import React, {PropTypes, Component} from 'react';
import {PageHeader, Table, Glyphicon, ButtonGroup, Button} from 'react-bootstrap';
import {Link} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import dateFormat from 'dateformat';

import SortableTh from './SortableTh';
import EntryCanWin, {Legend as CanWinLegend} from './CanWin';

export default class ResultsTable extends Component {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    onSort: PropTypes.func.isRequired,
    onCanWinCheck: PropTypes.func.isRequired,
    sortParams: PropTypes.object.isRequired,
    friends: PropTypes.bool,
    progress: PropTypes.object
  };

  handleCanWinCheck = (e, id) => {
    e.preventDefault();

    const {onCanWinCheck, entries, friends} = this.props;
    onCanWinCheck({entries, id, list: friends ? 'friends' : 'global'});
  }

  render() {
    const {entries, sortParams, friends, event, locked, locks, onSort, progress} = this.props;
    const hasResults = entries.length;

    const headerProps = hasResults ? {
      sortParams,
      onClick: onSort
    } : {};

    return (
      <div>
        <PageHeader>
          Results
          {' '}
          {friends && <small>(friends only) </small>}
          <ButtonGroup>
            <LinkContainer to={`/${event.id}/entries`}>
              <Button bsStyle='primary' bsSize='sm'><Glyphicon glyph='globe' /></Button>
            </LinkContainer>
            <LinkContainer to={`/${event.id}/entries/friends`}>
              <Button bsStyle='primary' bsSize='sm'><Glyphicon glyph='user' /></Button>
            </LinkContainer>
          </ButtonGroup>
        </PageHeader>
        <CanWinLegend progress={progress} />
        {!locked &&
          <p>Check back once the first round starts <strong>({dateFormat(new Date(locks), 'mmmm dS h:MMTT')})</strong> to see all the entries and the live results.</p>
        }
        {locked &&
          <Table condensed striped className='results-table'>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <SortableTh {...headerProps} hideXs sortKey='rounds.0'>Rd 1</SortableTh>
                <SortableTh {...headerProps} hideXs sortKey='rounds.1'>Rd 2</SortableTh>
                <SortableTh {...headerProps} hideXs sortKey='rounds.2'>S16</SortableTh>
                <SortableTh {...headerProps} hideXs sortKey='rounds.3'>E8</SortableTh>
                <SortableTh {...headerProps} hideXs sortKey='rounds.4'>FF</SortableTh>
                <SortableTh {...headerProps} hideXs sortKey='rounds.5'>NC</SortableTh>
                <SortableTh {...headerProps} sortKey='standard'>Score</SortableTh>
                <SortableTh {...headerProps} sortKey='standardPPR'>PPR</SortableTh>
                <SortableTh {...headerProps} hideXs hideSm sortKey='gooley'>Gooley</SortableTh>
                <SortableTh {...headerProps} hideXs hideSm sortKey='gooleyPPR'>Gooley PPR</SortableTh>
              </tr>
            </thead>
            <tbody>
              {!hasResults &&
                <tr><td colSpan='12'>{`There are no results yet ${friends ? 'from your friends ' : ''}for this event.`}</td></tr>
              }
              {entries.map((entry) =>
                <tr key={entry.id} className={entry.isMe ? 'info' : ''}>
                  <td>{entry.score.index}</td>
                  <td>
                    <Link to={`/${entry.sport}-${entry.year}/entries/${entry.user.id}`}>
                      {entry.user.username}
                    </Link>
                  </td>
                  {entry.score.rounds.map((round, roundIndex) =>
                    <td key={roundIndex} className='hidden-xs'>{round}</td>
                  )}
                  <td>
                    {entry.score.standard}
                    {' '}
                    <EntryCanWin {...{event, progress, entry}} onCanWinCheck={this.handleCanWinCheck} />
                  </td>
                  <td>{entry.score.standardPPR}</td>
                  <td className='hidden-xs hidden-sm'>{entry.score.gooley}</td>
                  <td className='hidden-xs hidden-sm'>{entry.score.gooleyPPR}</td>
                </tr>
              )}
            </tbody>
          </Table>
        }
      </div>
    );
  }
}
