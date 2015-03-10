let React = require('react');
let {Navigation} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let Bracket = require('./bracket/Container');

let bracketHelpers = require('../helpers/bracket');
let bracketEntryStore = require('../stores/bracketEntryStore');


module.exports = React.createClass({
    mixins: [ListenerMixin, Navigation],

    componentDidMount() {
        this.listenTo(bracketEntryStore, this.onChange);
    },

    getInitialState () {
        let {history, index} = bracketEntryStore.getState();
        return {history, index, bracket: history[index]};
    },

    onChange () {
        let state = this.getInitialState();
        this.setState(state);
        //this.replaceWith('landing', {path: state.history[state.index]});
    },

    render () {
        let {bracket} = this.state;
        let {sport, year} = this.props;
        let bracketObj = bracketHelpers({sport, year}).validate(bracket);

        return <Bracket {...this.props} {...this.state} bracketObj={bracketObj} bracket={bracket} />;
    }
});
