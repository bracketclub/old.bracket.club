let React = require('react');
let {Link} = require('react-router');


module.exports = React.createClass({
    render () {
        let {username, year, years, user_id} = this.props;
        return (
            <div>
                <h2>No {year} entry for {username}</h2>
                <p>
                    The user does not have an entry for {year}.
                    Check out their entries in {years.map(year =>
                        <Link to='user' params={{id: user_id, year: year}}>{year}</Link>
                    )}.
                </p>
            </div>
        );
    }
});
