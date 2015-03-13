let React = require('react');
let {State, Navigation} = require('react-router');

let Bracket = require('../components/bracket/Container');
let UserNotFound = require('../components/UserNotFound');
let EntryNotFound = require('../components/EntryNotFound');

let globalDataActions = require('../actions/globalDataActions');
let masterActions = require('../actions/masterActions');

let masterStore = require('../stores/masterStore');
let entryStore = require('../stores/entryStore');
let globalDataStore = require('../stores/globalDataStore');


module.exports = React.createClass({
    mixins: [State, Navigation],

    getInitialState () {
        let {history, index} = masterStore.getState();
        let {year} = globalDataStore.getState();
        let {id} = this.getParams();
        let {entries, users} =  entryStore.getState();
        let entry = entries[year][id];
        let user = users[id];

        return {
            bracket: history[year][index],
            history: history[year],
            year: year,
            index,
            user,
            entry,
            id
        };
    },

    componentWillMount () {
        masterStore.listen(this.onChange);
        entryStore.listen(this.onChange);
        globalDataStore.listen(this.onChange);

        let game = parseInt(this.getQuery().game, 10);

        if (!isNaN(game) && game !== masterStore.getState().index) {
            masterActions.getIndex(game);
        }

        let {year} = this.getParams();

        if (year) {
            globalDataActions.updateYear(year);
        }
    },

    getUser (props) {
        let {scorer} = globalDataStore.getState();
        let {bracket: master} = props;
        let entry = props.entry.bracket;
        return getRegions(scorer.diff({master, entry}));
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
        this.replaceWith('user', {id: state.id, year: state.year}, {game: index});
        this.setState(state);
    },

    render () {
        let {user, entry, year} = this.state;

        if (!user) {
            return <UserNotFound />;
        }

        if (!entry) {
            return <EntryNotFound {...user} year={year} />;
        }

        return <Bracket {...this.state} locked={true} />;
    }
});
