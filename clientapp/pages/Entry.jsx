let React = require('react');
let {State, Navigation} = require('react-router');

let Bracket = require('../components/bracket/Container');

let bracketEntryActions = require('../actions/bracketEntryActions');
let masterStore = require('../stores/masterStore');
let bracketEntryStore = require('../stores/bracketEntryStore');
let globalDataStore = require('../stores/globalDataStore');


module.exports = React.createClass({
    mixins: [State, Navigation],

    componentWillMount() {
        let {locked} = globalDataStore.getState();
        let {bracket} = this.getParams();
        let {bracket: storeBracket} = this.getBracketStore();

        bracketEntryStore.listen(this.onChange);
        globalDataStore.listen(this.onChange);
        masterStore.listen(this.onChange);

        if (!locked && bracket && bracket !== storeBracket) {
            bracketEntryActions.updateBracket(bracket);
        }
    },

    componentWillUnmount () {
        bracketEntryStore.unlisten(this.onChange);
        globalDataStore.unlisten(this.onChange);
        masterStore.unlisten(this.onChange);
    },

    getBracketStore () {
        let {locked, year} = globalDataStore.getState();
        let bracketHistory, index;
        if (locked) {
            let state = masterStore.getState();
            bracketHistory = state.history[year];
            index = state.index;
        } else {
            let state = bracketEntryStore.getState();
            bracketHistory = state.history;
            index = state.index;
        }
        return {bracket: bracketHistory[index], history: bracketHistory, index};
    },

    getInitialState () {
        let {locked} = globalDataStore.getState();
        let {bracket, history, index} = this.getBracketStore();

        return {bracket, history, index, locked};
    },

    componentWillReceiveProps () {
        this.setState(this.getParams());
    },

    onChange () {
        let state = this.getInitialState();
        let {bracket, locked} = state;

        if (!locked) {
            this.replaceWith('bracket', {bracket});
        }

        this.setState(state);
    },

    render () {
        return <Bracket {...this.state} />;
    }
});
