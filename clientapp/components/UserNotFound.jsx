let React = require('react');
let {PropTypes} = React;
let {Link} = require('react-router');


module.exports = React.createClass({
    propTypes: {
        year: PropTypes.string.isRequired
    },

    render () {
        return (
            <div>
                <h2>User not found</h2>
                <p>
                    The user doesn't have any brackets.
                    Check out the <Link to='resultsCurrent'>results page</Link> for a full list of users.
                </p>
            </div>
        );
    }
});
