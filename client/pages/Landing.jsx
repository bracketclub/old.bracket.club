let React = require('react');
let {State} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let FourOhFour = require('./FourOhFour');
let Bracket = require('../components/bracket/Container');

let {rYear} = require('../global');
let bracketHelpers = require('../helpers/bracket');

let bracketEntryStore = require('../stores/bracketEntryStore');
let masterStore = require('../stores/masterStore');


module.exports = React.createClass({
    mixins: [State, ListenerMixin],

    componentDidMount() {
        this.listenTo(bracketEntryStore, this.onChange);
        this.listenTo(masterStore, this.onChange);
        // Add the bracket from the url to the bracket entry store
        // only on the initial load (since the router action is null)
        // TODO: yada yada yada, is this the Right Way?
        // let {regex} = bracketHelpers({sport, year: props.year});
        // if (router.action === null && regex.test(router.params.path)) {
        //     bracketEntryActions.updateBracket(router.params.path);
        // }
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    getInitialState () {
        let {locked} = this.props;
        let {history, index} = (locked ? masterStore : bracketEntryStore).getState();
        return {history, index, urlParam: this.getParams().path};
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    render () {
        let {locked, sport, year} = this.props;
        let {urlParam, history: stateHistory, index} = this.state;
        let {regex} = bracketHelpers({sport, year});

        // The landing page is a few things dependent on state & url:

        // A locked master bracket for a previous year
        if (locked && rYear.test(urlParam)) {
            return <Bracket {...this.props} history={stateHistory[year]} index={index} />;
        }

        // A fallback url which will render the 404 for bad params
        if (urlParam && !regex.test(urlParam)) {
            return <FourOhFour />;
        }

        // The current unlocked entry
        return <Bracket {...this.props} history={stateHistory} index={index} />;
    }
});
