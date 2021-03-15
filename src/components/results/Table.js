import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  PageHeader,
  Table,
  Glyphicon,
  ButtonGroup,
  Button,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import dateFormat from 'dateformat'
import SortableTh from './SortableTh'
import EntryCanWin, { Legend as CanWinLegend } from './CanWin'

export default class ResultsTable extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    locked: PropTypes.bool.isRequired,
    locks: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    onSort: PropTypes.func.isRequired,
    onCanWinCheck: PropTypes.func.isRequired,
    sortParams: PropTypes.object.isRequired,
    friends: PropTypes.bool,
    progress: PropTypes.object,
    columns: PropTypes.array,
  }

  handleCanWinCheck = (e, id) => {
    e.preventDefault()

    const { onCanWinCheck, entries, friends } = this.props
    onCanWinCheck({ entries, id, list: friends ? 'friends' : 'global' })
  }

  render() {
    const {
      entries,
      sortParams,
      friends,
      event,
      locked,
      locks,
      onSort,
      progress,
      columns,
    } = this.props
    const hasResults = entries.length

    const headerProps = hasResults
      ? {
          sortParams,
          onClick: onSort,
        }
      : {}

    return (
      <div>
        <PageHeader>
          Results {friends && <small>(friends only) </small>}
          <ButtonGroup>
            <LinkContainer to={`/${event.id}/entries`}>
              <Button bsStyle="primary" bsSize="sm">
                <Glyphicon glyph="globe" />
              </Button>
            </LinkContainer>
            <LinkContainer to={`/${event.id}/entries/friends`}>
              <Button bsStyle="primary" bsSize="sm">
                <Glyphicon glyph="user" />
              </Button>
            </LinkContainer>
          </ButtonGroup>
        </PageHeader>
        <CanWinLegend progress={progress} />
        {!locked && (
          <p>
            Check back once the first round starts{' '}
            <strong>({dateFormat(new Date(locks), 'mmmm dS h:MMTT')})</strong>{' '}
            to see all the entries and the live results.
          </p>
        )}
        {locked && (
          <Table condensed striped className="results-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                {columns.map((column) => (
                  <SortableTh
                    {...headerProps}
                    hideXs={column.hideXs}
                    hideSm={column.hideSm}
                    key={column.key}
                    sortKey={column.key}
                  >
                    {column.display}
                  </SortableTh>
                ))}
              </tr>
            </thead>
            <tbody>
              {!hasResults && (
                <tr>
                  <td colSpan="99">{`There are no results yet ${
                    friends ? 'from your friends ' : ''
                  }for this event.`}</td>
                </tr>
              )}
              {entries.map((entry) => (
                <tr key={entry.id} className={entry.isMe ? 'info' : ''}>
                  <td>{entry.score.index}</td>
                  <td>
                    <Link
                      to={`/${entry.sport}-${entry.year}/entries/${entry.user.id}`}
                    >
                      {entry.user.username}
                    </Link>
                  </td>
                  {entry.score.rounds.map((round, roundIndex) => (
                    <td key={roundIndex} className="hidden-xs">
                      {round}
                      {entry.score.bonus
                        ? ` (${entry.score.bonus[roundIndex]})`
                        : ''}
                    </td>
                  ))}
                  <td>
                    {entry.score.standard}{' '}
                    <EntryCanWin
                      {...{ event, progress, entry }}
                      onCanWinCheck={this.handleCanWinCheck}
                    />
                  </td>
                  <td>{entry.score.standardPPR}</td>
                  {typeof entry.score.gooley !== undefined && (
                    <td className="hidden-xs hidden-sm">
                      {entry.score.gooley}
                    </td>
                  )}
                  {typeof entry.score.gooleyPPR !== undefined && (
                    <td className="hidden-xs hidden-sm">
                      {entry.score.gooleyPPR}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    )
  }
}
