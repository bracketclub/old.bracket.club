let React = require('react');
let {State} = require('react-router');
let app = require('../app');


module.exports = React.createClass({
    mixins: [State],
    getStateFromStore () {
        return {
            user: app.entries[this.getParams().user]
        };
    },
    getInitialState () {
        return this.getStateFromStore();
    },
    componentWillReceiveProps () {
        this.setState(this.getStateFromStore());
    },
    render () {
        let {user} = this.state;

        if (!user) {
            return <div>User not found</div>;
        }
        
        return <div>{user.user_id}!!</div>;
    }
});
