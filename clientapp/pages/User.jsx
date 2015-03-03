let React = require('react');
let {State, Navigation} = require('react-router');

let Bracket = require('../components/bracket/Container');
let UserNotFound = require('./UserNotFound');

let masterActions = require('../actions/masterActions');
let masterStore = require('../stores/masterStore');
let entryStore = require('../stores/entryStore');


module.exports = React.createClass({
    mixins: [State, Navigation],

    getInitialState () {
        let bracket = masterStore.getBracket();
        let {history, index} = masterStore.getState();
        let {username} = this.getParams();
        let user = entryStore.getState().entries[username.toLowerCase()];
        return {bracket, history, index, user, username};
    },

    componentWillMount () {
        masterStore.listen(this.onChange);
        entryStore.listen(this.onChange);

        let game = parseInt(this.getQuery().game, 10);

        if (!isNaN(game) && game !== masterStore.getState().index) {
            masterActions.getIndex(game);
        }
    },

    componentWillUnmount () {
        masterStore.unlisten(this.onChange);
        entryStore.unlisten(this.onChange);
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    onChange () {
        let state = this.getInitialState();
        let {index} = state;
        this.replaceWith('user', {username: this.state.username}, {game: index});
        this.setState(state);
    },

    render () {
        let {user, username} = this.state;

        if (!user) {
            return <UserNotFound user={username} />;
        }

        return <Bracket {...this.state} locked={true} />;
    }
});
