let React = require('react');
let {State, Navigation} = require('react-router');

let Bracket = require('../components/bracket/Container');

let bracketActions = require('../actions/bracketActions');
let masterStore = require('../stores/masterStore');
let bracketStore = require('../stores/bracketStore');
let globalDataStore = require('../stores/globalDataStore');


module.exports = React.createClass({
    mixins: [State, Navigation],

    componentWillMount() {
        let {locked} = globalDataStore.getState();
        let {bracket} = this.getParams();
        let storeBracket = this.getBracketStore().getBracket();

        bracketStore.listen(this.onChange);
        globalDataStore.listen(this.onChange);
        masterStore.listen(this.onChange);

        if (!locked && bracket && bracket !== storeBracket) {
            bracketActions.updateBracket(bracket);
        }
    },

    componentWillUnmount () {
        bracketStore.unlisten(this.onChange);
        globalDataStore.unlisten(this.onChange);
        masterStore.unlisten(this.onChange);
    },

    getBracketStore () {
        let {locked} = globalDataStore.getState();
        return locked ? masterStore : bracketStore; 
    },

    getInitialState () {
        let {locked} = globalDataStore.getState();
        let store = this.getBracketStore();
        let bracket = store.getBracket();
        let {history, index} = store.getState();

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
