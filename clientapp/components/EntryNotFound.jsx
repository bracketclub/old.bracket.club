let React = require('react');
let {PropTypes} = React;
let ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
let ButtonLink = require('react-router-bootstrap/lib/ButtonLink');


module.exports = React.createClass({
    propTypes: {
        username: PropTypes.string.isRequired,
        years: PropTypes.array.isRequired,
        user_id: PropTypes.string.isRequired,
        year: PropTypes.string
    },

    render () {
        let {username, year, years, user_id} = this.props;
        return (
            <div>
                {year ? <h2>No {year} entry for {username}</h2> : <h2>{username}</h2>}
                {year ? <p>The user does not have an entry for {year}.</p> : null}
                <h3>Entries</h3>
                <ButtonGroup>{years.map(year =>
                    <ButtonLink key={year} to='user' params={{id: user_id, year: year}}>{year}</ButtonLink>
                )}</ButtonGroup>
            </div>
        );
    }
});
