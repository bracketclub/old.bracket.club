let React = require('react');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let Bracket = require('./bracket/Container');

let bracketHelpers = require('../helpers/bracket');
let masterStore = require('../stores/masterStore');


let Master = React.createClass({
    mixins: [ListenerMixin],

    componentDidMount() {
        this.listenTo(masterStore, this.onChange);
    },

    getInitialState () {
        let {history, index} = masterStore.getState();
        history = history[this.props.year];
        return {history, index};
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    render () {
        let {history, index} = this.state;
        let {sport, year, locked} = this.props;

        let bracket = history[index];
        let bracketObj = bracketHelpers({sport, year}).validate(bracket);

        let bracketProps = {
            sport,
            year,
            bracketObj,
            bracket,
            locked,
            history,
            index
        };

        return <Bracket {...bracketProps} />;
    }
});

module.exports = Master;
