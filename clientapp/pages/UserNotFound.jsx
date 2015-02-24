let React = require('react');
let {State} = require('react-router');


module.exports = React.createClass({
    mixins: [State],
    render () {
        let {user} = this.getParams();
        return <div>{user} could not be found</div>;
    }
});
