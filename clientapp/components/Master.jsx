let React = require('react');
let {PropTypes} = React;
let ListenerMixin = require('alt/mixins/ListenerMixin');

let Bracket = require('./bracket/Container');

let bracketHelpers = require('../helpers/bracket');
let masterStore = require('../stores/masterStore');


let Master = React.createClass({
    mixins: [ListenerMixin],

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        locked: PropTypes.bool.isRequired
    },

    componentDidMount() {
        this.listenTo(masterStore, this.onChange);
    },

    getInitialState (props) {
        let {history, index} = masterStore.getState();
        history = history[(props || this.props).year];
        return {history, index};
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    // TODO: is this idiomatic React?
    // This is necessary because getInitialState relies on the year
    // and the year prop comes from a react-router param
    componentWillReceiveProps (nextProps) {
        this.setState(this.getInitialState(nextProps));
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
