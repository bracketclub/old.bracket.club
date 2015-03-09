let React = require('react');
let {State, Navigation, Link} = require('react-router');
let sort = require('lodash/collection/sortBy');
let map = require('lodash/collection/map');

let TimeAgo = require('react-timeago');
let Table = require('react-bootstrap/lib/Table');
let BracketNav = require('../components/bracket/Nav');
let BracketProgress = require('../components/bracket/Progress');

let masterActions = require('../actions/masterActions');
let entryStore = require('../stores/entryStore');
let masterStore = require('../stores/masterStore');
let globalDataStore = require('../stores/globalDataStore');


module.exports = React.createClass({
    mixins: [State, Navigation],

    sortEntriesByScore (bracket, year) {
        let entries = map(entryStore.getState().entries[year], (_entry) => {
            _entry.score = _entry.bracket;
            return _entry;
        });
        let {scorer} = globalDataStore.getState();

        return sort(scorer.score(
            ['standard', 'standardPPR', 'rounds', 'gooley', 'gooleyPPR'],
            {master: bracket, entry: entries}
        ), function (entry) {
            return -entry.score.standard;
        });
    },

    getInitialState () {
        let {index, history} = masterStore.getState();
        let {bracketData, locked, year} = globalDataStore.getState();
        let bracket = history[year][index];
        let {locks} = bracketData;
        let entries = this.sortEntriesByScore(bracket, year);
        return {bracket, history: history[year], index, entries, locked, locks};
    },

    componentWillMount () {
        masterStore.listen(this.onChange);
        entryStore.listen(this.onChange);
        globalDataStore.listen(this.onChange);

        let game = parseInt(this.getQuery().game, 10);

        if (!isNaN(game) && game !== masterStore.getState().index) {
            masterActions.getIndex(game);
        }
    },

    componentWillUnmount () {
        masterStore.unlisten(this.onChange);
        entryStore.unlisten(this.onChange);
        globalDataStore.unlisten(this.onChange);
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    onChange () {
        let state = this.getInitialState();
        let {index} = state;
        this.replaceWith('results', null, {game: index});
        this.setState(state);
    },

    render () {
        let {entries, locked, locks, history, index, bracket} = this.state;

        let tbody = (
            <tbody>
                {locked ?
                    entries.map((entry, index) => 
                        <tr>
                            <td>{index + 1}</td>
                            <td><Link to='user' params={{id: entry.user_id}}>{entry.username}</Link></td>
                            {entry.score.rounds.map(round => 
                                <td className='hidden-xs'>{round}</td>
                            )}
                            <td>{entry.score.standard}</td>
                            <td>{entry.score.standardPPR}</td>
                            <td>{entry.score.gooley}</td>
                            <td>{entry.score.gooleyPPR}</td>
                        </tr>
                    ) :
                    <tr>
                        <td colSpan='12'>
                            Entries don't lock until <TimeAgo date={locks} title={locks} />. Check back then to see the results.<br />If you haven't filled out your bracket yet, head over to <Link to='bracket' params={{bracket: ''}}>the entry page</Link> before it's too late.
                        </td>
                    </tr>
                }
            </tbody>
        );

        return (
            <div>
                <BracketNav locked={true} history={history} index={index} />
                <BracketProgress bracket={bracket} />
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
