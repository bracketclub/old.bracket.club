let React = require('react');
let {State, Navigation} = require('react-router');
let sort = require('lodash/collection/sortBy');
let map = require('lodash/collection/map');

let Table = require('react-bootstrap/lib/Table');
let BracketNav = require('../components/bracket/Nav');
let BracketProgress = require('../components/bracket/Progress');

let masterActions = require('../actions/masterActions');
let entryStore = require('../stores/entryStore');
let masterStore = require('../stores/masterStore');
let globalDataStore = require('../stores/globalDataStore');


module.exports = React.createClass({
    mixins: [State, Navigation],

    sortEntriesByScore (bracket) {
        let entries = map(entryStore.getState().entries, (_entry) => {
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
        let bracket = masterStore.getBracket();
        let {history, index} = masterStore.getState();
        let entries = this.sortEntriesByScore(bracket);
        return {bracket, history, index, entries};
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
        let {entries} = this.state;
        return (
            <div>
                <BracketNav locked={true} history={this.state.history} index={this.state.index} />
                <BracketProgress bracket={this.state.bracket} progressText='games played' />
                <Table condensed striped responsive>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Rd 1</th>
                            <th>Rd 2</th>
                            <th>S16</th>
                            <th>E8</th>
                            <th>FF</th>
                            <th>NC</th>
                            <th>Score</th>
                            <th>PPR</th>
                            <th>Gooley</th>
                            <th>Gooley PPR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => 
                            <tr>
                                <td>{index + 1}</td>
                                <td>{entry.username}</td>
                                {entry.score.rounds.map(round => 
                                    <td>{round}</td>
                                )}
                                <td>{entry.score.standard}</td>
                                <td>{entry.score.standardPPR}</td>
                                <td>{entry.score.gooley}</td>
                                <td>{entry.score.gooleyPPR}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                
            </div>
        );
    }
});
