let React = require('react');
let {Link} = require('react-router');


module.exports = React.createClass({
    render () {
        return (
            <div>
                <h2>User not found</h2>
                <p>
                    The user does not exist.
                    Check out the <Link to='results'>results page</Link> for a full list of users.
                </p>
            </div>
        );
    }
});
