let React = require('react');
let {PropTypes} = React;
let {ButtonGroup} = require('react-bootstrap');
let {ButtonLink} = require('react-router-bootstrap');


module.exports = React.createClass({
    propTypes: {
        username: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        years: PropTypes.array.isRequired,
        user_id: PropTypes.string.isRequired
    },

    render () {
        let {username, year, years, user_id} = this.props;
        return (
            <div>
                <h2>No {year} entry for {username}</h2>
                <p>
                    The user does not have an entry for {year}.
                    Check out their other entries in
                    <ButtonGroup>{years.map(year =>
                        <ButtonLink key={year} to='user' params={{id: user_id, year: year}}>{year}</ButtonLink>
                    )}</ButtonGroup>.
                </p>
            </div>
        );
    }
});
