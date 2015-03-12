let React = require('react');
let {State, Navigation, Link} = require('react-router');
let sortBy = require('lodash/collection/sortBy');
let map = require('lodash/collection/map');
let pluck = require('lodash/collection/pluck');
let zipObject = require('lodash/array/zipObject');

let TimeAgo = require('react-timeago');
let Table = require('react-bootstrap/lib/Table');
let BracketNav = require('../components/bracket/Nav');
let BracketProgress = require('../components/bracket/Progress');

let bracketHelpers = require('../helpers/bracket');
let entryStore = require('../stores/entryStore');
let masterStore = require('../stores/masterStore');

let scoreTypes = ['standard', 'standardPPR', 'rounds', 'gooley', 'gooleyPPR'];


let Results = React.createClass({
    mixins: [State, Navigation],

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
        
        return sortBy(map(entries, function (entry, index) {
            entry.score = scores[index];
            return entry;
        }), function (entry) {
            return -entry.score.standard;
        });
    },

    getInitialState () {
        let {index, history} = masterStore.getState();
        let {entries} = entryStore.getState();

        return {index, history, entries};
    },

    componentWillMount () {
        masterStore.listen(this.onChange);
        entryStore.listen(this.onChange);
    },

    componentWillUnmount () {
        masterStore.unlisten(this.onChange);
        entryStore.unlisten(this.onChange);
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    render () {
        let {history: historyByYear, index, entries} = this.state;
        let {locked, sport, year} = this.props;

        let history = historyByYear[year];
        let {locks} = bracketHelpers({sport, year});
        let bracket = history[index];

        let tbody = (
            <tbody>
                {locked ?
                    this.sortEntriesByScore(entries[year], bracket).map((entry, index) => 
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td><Link to='user' params={{id: entry.user_id}}>{entry.username}</Link></td>
                            {entry.score.rounds.map((round, index) => 
                                <td key={index} className='hidden-xs'>{round}</td>
                            )}
                            <td>{entry.score.standard}</td>
                            <td>{entry.score.standardPPR}</td>
                            <td>{entry.score.gooley}</td>
                            <td>{entry.score.gooleyPPR}</td>
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
                <BracketNav locked={true} history={history} index={index} />
                <BracketProgress bracket={bracket} sport={sport} year={year} locked={locked} />
                <Table condensed striped responsive>
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
                            <th>Gooley</th>
                            <th>Gooley PPR</th>
                        </tr>
                    </thead>
                    {tbody}
                </Table>
                
            </div>
        );
    }
});

module.exports = Results;
