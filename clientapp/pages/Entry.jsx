let React = require('react');
let {State, Navigation} = require('react-router');
let ListenerMixin = require('alt/mixins/listenerMixin');

let Bracket = require('../components/bracket/Container');

let bracketActions = require('../actions/bracketActions');
let masterStore = require('../stores/masterStore');
let bracketStore = require('../stores/bracketStore');
let globalDataStore = require('../stores/globalDataStore');


module.exports = React.createClass({
    mixins: [State, Navigation, ListenerMixin],

    componentWillMount() {
        let {locked} = globalDataStore.getState();
        let {bracket} = this.getParams();

        bracketStore.listen(this.onChange);
        globalDataStore.listen(this.onChange);
        masterStore.listen(this.onChange);

        if (!locked && bracket && bracket !== bracketStore.getBracket()) {
            bracketActions.updateBracket(bracket);
        }
    },

    getInitialState () {
        let {locked} = globalDataStore.getState();
        let store = locked ? masterStore : bracketStore;
        let bracket = store.getBracket();
        let {history, index} = store.getState();

        return {bracket, history, index, locked};
    },

    componentWillReceiveProps () {
        this.setState(this.getParams());
    },

    onChange () {
        let state = this.getInitialState();
        let {bracket} = state;
        this.replaceWith('bracket', {bracket});
        this.setState(state);
    },

    render () {
        return <Bracket {...this.state} />;
    }
});
