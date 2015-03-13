let React = require('react');
let {PropTypes} = React;
let {State} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let UserNotFound = require('../components/UserNotFound');
let EntryNotFound = require('../components/EntryNotFound');

let entryStore = require('../stores/entryStore');


let UserEntry = React.createClass({
    mixins: [State, ListenerMixin],

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired
    },

    componentDidMount() {
        this.listenTo(entryStore, this.onChange);
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    getInitialState () {
        let {users} = entryStore.getState();
        let {id} = this.getParams();
        return {users, id};
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    render () {
        let {year} = this.props;
        let {id, users} = this.state;

        let user = users[id];

        if (!user) {
            return <UserNotFound year={year} />;
        }

        return <EntryNotFound {...user} />;
    }
});

module.exports = UserEntry;
