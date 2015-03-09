let React = require('react');
let {State, Navigation} = require('react-router');

let Bracket = require('../components/bracket/Container');
let UserNotFound = require('./UserNotFound');

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
        let user = entryStore.getState().entries[year][id];
        return {bracket: history[year][index], history: history[year], index, user, id};
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
        this.replaceWith('user', {id: this.state.id}, {game: index});
        this.setState(state);
    },

    render () {
        let {user} = this.state;

        if (!user) {
            return <UserNotFound />;
        }

        return <Bracket {...this.state} locked={true} />;
    }
});
