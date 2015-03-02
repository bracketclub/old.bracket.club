let React = require('react');
let {State, Navigation} = require('react-router');
let ListenerMixin = require('alt/mixins/listenerMixin');

let Bracket = require('../components/bracket/Container');

let bracketActions = require('../actions/bracketActions');
let bracketStore = require('../stores/bracketStore');
let globalDataStore = require('../stores/globalDataStore');


module.exports = React.createClass({
    mixins: [State, Navigation, ListenerMixin],
    componentWillMount() {
        let {bracket} = this.getParams();

        bracketStore.listen(this.onBracketChange);
        globalDataStore.listen(this.onBracketChange);

        if (bracket) {
            bracketActions.updateBracket(bracket);
        }
    },

    getInitialState () {
        let {bracket} = bracketStore.getBracket();
        let {history, index} = bracketStore.getState();
        let {locked} = globalDataStore.getState();
        return {bracket, history, index, locked};
    },

    componentWillReceiveProps () {
        this.setState(this.getParams());
    },

    onBracketChange () {
        let state = this.getInitialState();
        let {bracket} = state;
        this.replaceWith('bracket', {bracket});
        this.setState(state);
    },

    render () {
        return <Bracket {...this.state} />;
    }
});
