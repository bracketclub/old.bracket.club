let React = require('react');
let {classSet} = require('react/addons').addons;
let {Link} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let last = require('lodash/array/last');
let sortedIndex = require('lodash/array/sortedIndex');
let sortBy = require('lodash/collection/sortBy');
let map = require('lodash/collection/map');
let pluck = require('lodash/collection/pluck');
let zipObject = require('lodash/array/zipObject');
let isNumber = require('lodash/lang/isNumber');
let cloneDeep = require('lodash/lang/cloneDeep');
let extend = require('lodash/object/extend');

let Glyphicon = require('react-bootstrap/lib/Glyphicon');
let TimeAgo = require('react-timeago');
let Table = require('react-bootstrap/lib/Table');
let BracketHeader = require('../components/bracket/Header');
let Loading = require('../components/Loading');

let bracketHelpers = require('../helpers/bracket');
let entryStore = require('../stores/entryStore');
let masterStore = require('../stores/masterStore');

let scoreTypes = ['standard', 'standardPPR', 'rounds', 'gooley', 'gooleyPPR'];

let sortEntryByScore = (sortByScore, dir) => {
    let sortByIndex, sortByKey = sortByScore;

    if (sortByKey.indexOf('.') > -1) {
        sortByKey = sortByScore.split('.')[0];
        sortByIndex = parseInt(sortByScore.split('.')[1]);
    }
    return (entry) => {
        let sortVal = entry.score[sortByKey];
        return (isNumber(sortByIndex) && !isNaN(sortByIndex) ? sortVal[sortByIndex] : sortVal) * dir;
    };
};
let standardSort = sortEntryByScore('standard', -1);

let SortableTh = React.createClass({
    render () {
        let active = this.props.sortKey === this.props.sortByCol;
        let cx = classSet({
            'hidden-xs': this.props.hideXs,
            'hidden-sm': this.props.hideSm,
            'active': active,
            'sortable-col': true
        });
        return (
            <th className={cx} onClick={this.props.handleClick.bind(null, this.props.sortKey)}>
                {this.props.children}
                <Glyphicon className={active ? '' : 'invisible'} glyph={'chevron-' + (this.props.sortByDir === -1 ? 'up' : 'down')} />
            </th>
        );
    }
});


let Results = React.createClass({
    mixins: [ListenerMixin],

    sortEntriesByScore (entries, bracket) {
        let {year, sport} = this.props;
        let ids = pluck(entries, 'user_id');
        let score = bracketHelpers({sport, year}).score;
        let scores = zipObject(
            ids,
            score(scoreTypes, {
                master: bracket,
                entry: pluck(entries, 'bracket')
            })
        );

        // First sort by our standard score desc sort so we can get the index later
        // Clone because we alter the entries
        let standardWithScore = sortBy(map(cloneDeep(entries), (entry, index) => {
            entry.score = scores[index];
            return entry;
        }), standardSort);

        // this is our display order but we map the index to the "offical" sort order
        // so even if we sort by a different column you can still see the real 1st, 2nd etc
        let displaySort = sortEntryByScore(this.state.sortByCol, this.state.sortByDir);
        return sortBy(standardWithScore, displaySort).map((entry) => {
            // Sorted index keeps track of ties so if 3 people are tied for first they all get 0
            entry.index = sortedIndex(standardWithScore, entry, standardSort);
            return entry;
        });
    },

    getStateFromStore () {
        let {index, history, loading: masterLoading} = masterStore.getState();
        let {entries, loading: entryLoading} = entryStore.getState();
        return {index, history, entries, loading: entryLoading || masterLoading};
    },

    getInitialState () {
        return extend({
            sortByDir: -1,
            sortByCol: 'standard'
        }, this.getStateFromStore());
    },

    componentDidMount () {
        this.listenTo(masterStore, this.onChange);
        this.listenTo(entryStore, this.onChange);
    },

    onChange () {
        this.setState(this.getStateFromStore());
    },

    handleSortClick (col) {
        let {sortByDir, sortByCol} = this.state;
        // If we are sorting by the came column again, then alternate asc/desc
        let dir = sortByCol === col ? sortByDir * -1 : sortByDir;
        this.setState({sortByCol: col, sortByDir: dir});
    },

    render () {
        let {history: historyByYear, index, entries, sortByCol, sortByDir, loading} = this.state;
        let {locked, sport, year, me} = this.props;

        let history = historyByYear[year];
        let bracket = history[index];
        let {locks} = bracketHelpers({sport, year});

        // Protect against switching from game indices that are further along
        // than the current year. Default is to use the latest bracket
        // TODO: might not be the best way to do this. It should be protected
        // in the data store maybe?
        if (!bracket) {
            bracket = last(history);
            index = history.length - 1;
        }

        let headerProps = {sortByCol, sortByDir, handleClick: this.handleSortClick};

        if (loading) {
            return <Loading />;
        }

        return (
            <div>
                <BracketHeader locked={true} history={history} index={index} sport={sport} year={year} />
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
                        {locked ?
                            this.sortEntriesByScore(entries[year], bracket).map((entry, index) => 
                                <tr key={index} className={me.id === entry.user_id ? 'info' : ''}>
                                    <td>{entry.index + 1}</td>
                                    <td><Link to='user' params={{id: entry.user_id, year: year}}>{entry.username}</Link></td>
                                    {entry.score.rounds.map((round, index) => 
                                        <td key={index} className='hidden-xs'>{round}</td>
                                    )}
                                    <td>{entry.score.standard}</td>
                                    <td>{entry.score.standardPPR}</td>
                                    <td className='hidden-xs hidden-sm'>{entry.score.gooley}</td>
                                    <td className='hidden-xs hidden-sm'>{entry.score.gooleyPPR}</td>
                                </tr>
                            ) :
                            <tr>
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
