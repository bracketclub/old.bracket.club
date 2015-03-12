let React = require('react');
let {PropTypes} = React;
let {RouteHandler} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let Header = require('./Header');
let Footer = require('./Footer');

let meStore = require('../stores/meStore');
let globalDataStore = require('../stores/globalDataStore');


let App = React.createClass({
    mixins: [ListenerMixin],

    propTypes: {
        fluid: PropTypes.bool.isRequired,
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired
    },

    getInitialState () {
        return {
            me: meStore.getState(),
            locked: globalDataStore.getState().locked
        };
    },

    componentDidMount() {
        this.listenTo(meStore, this.onChange);
        this.listenTo(globalDataStore, this.onChange);
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    render () {
        let {me, locked} = this.state;
        let {year, sport, fluid} = this.props;
        return (
            <div>
                <Header year={year} me={me} />
                <div className={fluid ? 'container-fluid' : 'container'}>
                    <RouteHandler sport={sport} year={year} me={me} locked={locked} />
                    <Footer me={me} />
                </div>
            </div>
        );
    }
});

module.exports = App;
