'use strict';

const React = require('react');
const classNames = require('classnames');
const {Link} = require('react-router');
const ListenerMixin = require('alt/mixins/ListenerMixin');

const last = require('lodash/array/last');
const sortedIndex = require('lodash/array/sortedIndex');
const sortBy = require('lodash/collection/sortBy');
const map = require('lodash/collection/map');
const pluck = require('lodash/collection/pluck');
const zipObject = require('lodash/array/zipObject');
const isNumber = require('lodash/lang/isNumber');
const cloneDeep = require('lodash/lang/cloneDeep');
const extend = require('lodash/object/extend');

const Glyphicon = require('react-bootstrap/lib/Glyphicon');
const TimeAgo = require('react-timeago');
const Table = require('react-bootstrap/lib/Table');
const BracketHeader = require('../components/bracket/Header');
const Loading = require('../components/Loading');

const bracketHelpers = require('../helpers/bracket');
const entryStore = require('../stores/entryStore');
const masterStore = require('../stores/masterStore');

const scoreTypes = ['standard', 'standardPPR', 'rounds', 'gooley', 'gooleyPPR'];

const sortEntryByScore = (sortByScore, dir) => {
  let sortByIndex;
  let sortByKey = sortByScore;

  if (sortByKey.indexOf('.') > -1) {
    sortByKey = sortByScore.split('.')[0];
    sortByIndex = parseInt(sortByScore.split('.')[1], 10);
  }

  return (entry) => {
    const sortVal = entry.score[sortByKey];
    return (isNumber(sortByIndex) && !isNaN(sortByIndex) ? sortVal[sortByIndex] : sortVal) * dir;
  };
};
const standardSort = sortEntryByScore('standard', -1);

const SortableTh = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
    hideXs: React.PropTypes.bool,
    hideSm: React.PropTypes.bool,
    sortByCol: React.PropTypes.string.isRequired,
    handleClick: React.PropTypes.func.isRequired,
    sortKey: React.PropTypes.string.isRequired,
    sortByDir: React.PropTypes.number.isRequired
  },

  render() {
    const active = this.props.sortKey === this.props.sortByCol;
    const cx = classNames({
      'hidden-xs': this.props.hideXs,
      'hidden-sm': this.props.hideSm,
      active,
      'sortable-col': true
    });
    return (
      <th className={cx} onClick={this.props.handleClick.bind(null, this.props.sortKey)}>
        {this.props.children}
        <Glyphicon className={active ? '' : 'invisible'} glyph={`chevron-${this.props.sortByDir === -1 ? 'up' : 'down'}`} />
      </th>
    );
  }
});

const Results = React.createClass({
  mixins: [ListenerMixin],

  propTypes: {
    sport: React.PropTypes.string.isRequired,
    year: React.PropTypes.string.isRequired,
    locked: React.PropTypes.bool,
    me: React.PropTypes.object
  },

  sortEntriesByScore(entries, bracket) {
    const {year, sport} = this.props;
    const ids = pluck(entries, 'user_id');
    const score = bracketHelpers({sport, year}).score;
    const scores = zipObject(
          ids,
          score(scoreTypes, {
            master: bracket,
            entry: pluck(entries, 'bracket')
          })
      );

      // First sort by our standard score desc sort so we can get the index later
      // Clone because we alter the entries
    const standardWithScore = sortBy(map(cloneDeep(entries), (entry, index) => {
      entry.score = scores[index];
      return entry;
    }), standardSort);

      // this is our display order but we map the index to the "offical" sort order
      // so even if we sort by a different column you can still see the real 1st, 2nd etc
    const displaySort = sortEntryByScore(this.state.sortByCol, this.state.sortByDir);
    return sortBy(standardWithScore, displaySort).map((entry) => {
      // Sorted index keeps track of ties so if 3 people are tied for first they all get 0
      entry.index = sortedIndex(standardWithScore, entry, standardSort);
      return entry;
    });
  },

  getStateFromStore() {
    const {index, history, loading: masterLoading} = masterStore.getState();
    const {entries, loading: entryLoading} = entryStore.getState();
    return {index, history, entries, loading: entryLoading || masterLoading};
  },

  getInitialState() {
    return extend({
      sortByDir: -1,
      sortByCol: 'standard'
    }, this.getStateFromStore());
  },

  componentDidMount() {
    this.listenTo(masterStore, this.onChange);
    this.listenTo(entryStore, this.onChange);
  },

  onChange() {
    this.setState(this.getStateFromStore());
  },

  handleSortClick(col) {
    const {sortByDir, sortByCol} = this.state;
    // If we are sorting by the came column again, then alternate asc/desc
    const dir = sortByCol === col ? sortByDir * -1 : sortByDir;
    this.setState({sortByCol: col, sortByDir: dir});
  },

  render() {
    let {index} = this.state;
    const {history: historyByYear, entries, sortByCol, sortByDir, loading} = this.state;
    const {locked, sport, year, me} = this.props;

    const history = historyByYear[year];
    let bracket = history[index];
    const {locks} = bracketHelpers({sport, year});

    // Protect against switching from game indices that are further along
    // than the current year. Default is to use the latest bracket
    // TODO: might not be the best way to do this. It should be protected
    // in the data store maybe?
    if (!bracket) {
      bracket = last(history);
      index = history.length - 1;
    }

    const headerProps = {sortByCol, sortByDir, handleClick: this.handleSortClick};

    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        <BracketHeader
          locked
          history={history}
          index={index}
          sport={sport}
          year={year}
        />
        <Table condensed striped className='results-table'>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <SortableTh {...headerProps} hideXs sortKey={'rounds.0'}>Rd 1</SortableTh>
              <SortableTh {...headerProps} hideXs sortKey={'rounds.1'}>Rd 2</SortableTh>
              <SortableTh {...headerProps} hideXs sortKey={'rounds.2'}>S16</SortableTh>
              <SortableTh {...headerProps} hideXs sortKey={'rounds.3'}>E8</SortableTh>
              <SortableTh {...headerProps} hideXs sortKey={'rounds.4'}>FF</SortableTh>
              <SortableTh {...headerProps} hideXs sortKey={'rounds.5'}>NC</SortableTh>
              <SortableTh {...headerProps} sortKey={'standard'}>Score</SortableTh>
              <SortableTh {...headerProps} sortKey={'standardPPR'}>PPR</SortableTh>
              <SortableTh {...headerProps} hideXs hideSm sortKey={'gooley'}>Gooley</SortableTh>
              <SortableTh {...headerProps} hideXs hideSm sortKey={'gooleyPPR'}>Gooley PPR</SortableTh>
            </tr>
          </thead>
          <tbody>
            {locked
              ? this.sortEntriesByScore(entries[year], bracket).map((entry) =>
                <tr key={entry.username} className={me.id === entry.user_id ? 'info' : ''}>
                  <td>{entry.index + 1}</td>
                  <td><Link to='user' params={{id: entry.user_id, year}}>{entry.username}</Link></td>
                  {entry.score.rounds.map((round, roundIndex) =>
                    <td key={roundIndex} className='hidden-xs'>{round}</td>
                  )}
                  <td>{entry.score.standard}</td>
                  <td>{entry.score.standardPPR}</td>
                  <td className='hidden-xs hidden-sm'>{entry.score.gooley}</td>
                  <td className='hidden-xs hidden-sm'>{entry.score.gooleyPPR}</td>
                </tr>
              )
              : <tr>
                <td colSpan='12'>
                  Entries don't lock until <TimeAgo date={locks} title={locks} />. Check back then to see the results.<br />If you haven't filled out your bracket yet, head over to <Link to='landing'>the entry page</Link> before it's too late.
                </td>
              </tr>
            }
          </tbody>
        </Table>
      </div>
    );
  }
});

module.exports = Results;
