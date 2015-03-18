let React = require('react');
let {State} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');
let raf = require('raf');

let FourOhFour = require('./FourOhFour');
let Bracket = require('../components/bracket/Container');

let {rYear} = require('../global');
let bracketHelpers = require('../helpers/bracket');

let bracketEntryActions = require('../actions/bracketEntryActions');
let bracketEntryStore = require('../stores/bracketEntryStore');
let masterStore = require('../stores/masterStore');

window.crohn = () => {
    bracketEntryActions.generate('random');
    raf(window.crohn);
    return 'So brave. Now just Tweet Your Bracket!';
};

module.exports = React.createClass({
    mixins: [State, ListenerMixin],

    componentDidMount() {
        // Update store to contain the bracket from the url
        // Note: store protects against falsy and bad values
        bracketEntryActions.updateBracket(this.getParams().path);
        this.listenTo(bracketEntryStore, this.onChange);
        this.listenTo(masterStore, this.onChange);
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    getInitialState (props) {
        let {locked} = (props || this.props);
        let {history, index} = (locked ? masterStore : bracketEntryStore).getState();
        return {history, index, urlParam: this.getParams().path};
    },

    componentWillReceiveProps (nextProps) {
        this.setState(this.getInitialState(nextProps));
    },

    render () {
        let {locked, sport, year} = this.props;
        let {urlParam, history: stateHistory, index} = this.state;
        let {regex} = bracketHelpers({sport, year});

        // The landing page is a few things dependent on state & url:
        if (locked) {
            // A locked master bracket for a previous year
            return <Bracket {...this.props} history={stateHistory[year]} index={index} />;
        }
        else if (!urlParam || rYear.test(urlParam) || regex.test(urlParam)) {
            // The current unlocked entry
            return <Bracket {...this.props} history={stateHistory} index={index} />;
        }

        // A fallback url which will render the 404 for bad params
        return <FourOhFour />;
    }
});
