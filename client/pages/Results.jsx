let React = require('react');
let {Link} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let last = require('lodash/array/last');
let sortedIndex = require('lodash/array/sortedIndex');
let sortBy = require('lodash/collection/sortBy');
let map = require('lodash/collection/map');
let pluck = require('lodash/collection/pluck');
let zipObject = require('lodash/array/zipObject');

let TimeAgo = require('react-timeago');
let Table = require('react-bootstrap/lib/Table');
let BracketHeader = require('../components/bracket/Header');

let bracketHelpers = require('../helpers/bracket');
let entryStore = require('../stores/entryStore');
let masterStore = require('../stores/masterStore');

let scoreTypes = ['standard', 'standardPPR', 'rounds', 'gooley', 'gooleyPPR'];

let standardScoreDesc = (entry) => -entry.score.standard;


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
        
        let sorted = sortBy(map(entries, (entry, index) => {
            entry.score = scores[index];
            return entry;
        }), standardScoreDesc);

        sorted = sorted.map(function (entry) {
            entry.index = sortedIndex(sorted, entry, standardScoreDesc);
            return entry;
        });

        return sorted;
    },

    getInitialState () {
        let {index, history} = masterStore.getState();
        let {entries} = entryStore.getState();

        return {index, history, entries};
    },

    componentDidMount () {
        this.listenTo(masterStore, this.onChange);
        this.listenTo(entryStore, this.onChange);
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    render () {
        let {history: historyByYear, index, entries} = this.state;
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

        let tbody = (
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
                            <td className='hidden-xs'>{entry.score.gooley}</td>
                            <td className='hidden-xs'>{entry.score.gooleyPPR}</td>
                        </tr>
                    ) :
                    <tr>
                        <td colSpan='12'>
                            Entries don't lock until <TimeAgo date={locks} title={locks} />. Check back then to see the results.<br />If you haven't filled out your bracket yet, head over to <Link to='landing' params={{bracket: ''}}>the entry page</Link> before it's too late.
                        </td>
                    </tr>
                }
            </tbody>
        );

        return (
            <div>
                <BracketHeader locked={true} history={history} index={index} sport={sport} year={year} />
                <Table condensed striped>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th className='hidden-xs'>Rd 1</th>
                            <th className='hidden-xs'>Rd 2</th>
                            <th className='hidden-xs'>S16</th>
                            <th className='hidden-xs'>E8</th>
                            <th className='hidden-xs'>FF</th>
                            <th className='hidden-xs'>NC</th>
                            <th>Score</th>
                            <th>PPR</th>
                            <th className='hidden-xs'>Gooley</th>
                            <th className='hidden-xs'>Gooley PPR</th>
                        </tr>
                    </thead>
                    {tbody}
                </Table>
                
            </div>
        );
    }
});

module.exports = Results;
