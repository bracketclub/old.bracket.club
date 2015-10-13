'use strict';

let React = require('react');
let {PropTypes} = React;
let ListenerMixin = require('alt/mixins/ListenerMixin');

let Loading = require('../components/Loading');
let UserNotFound = require('../components/user/NotFound');
let UserEntries = require('../components/user/Entries');

let entryStore = require('../stores/entryStore');


let UserEntry = React.createClass({
    mixins: [ListenerMixin],

    contextTypes: {
        router: React.PropTypes.func
    },

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired
    },

    componentDidMount () {
        this.listenTo(entryStore, this.onChange);
    },

    getInitialState () {
        let {users, loading} = entryStore.getState();
        let {id} = this.context.router.getCurrentParams();
        return {user: users[id], loading};
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    render () {
        let {year} = this.props;
        let {user, loading} = this.state;

        if (loading) {
            return <Loading />;
        }

        if (!user) {
            return <UserNotFound year={year} />;
        }

        return <UserEntries {...user} />;
    }
});

module.exports = UserEntry;