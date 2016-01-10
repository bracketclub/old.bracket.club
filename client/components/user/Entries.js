'use strict';

const React = require('react');
const {PropTypes} = React;
const ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
const Button = require('react-bootstrap/lib/Button');
const LinkContainer = require('react-router-bootstrap/lib/LinkContainer');

const UserEntries = React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    years: PropTypes.array.isRequired,
    user_id: PropTypes.string.isRequired, // eslint-disable-line camelcase
    year: PropTypes.string
  },

  render() {
    const {
      username,
      year,
      years,
      user_id: userId // eslint-disable-line camelcase
    } = this.props;

    return (
      <div>
        {year ? <h2>No {year} entry for {username}</h2> : <h2>{username}</h2>}
        {year ? <p>The user does not have an entry for {year}.</p> : null}
        <h3>Entries</h3>
        <ButtonGroup>
          {years.map((buttonYear) =>
            <LinkContainer key={buttonYear} to='user' params={{id: userId, year: buttonYear}}>
              <Button>
                {buttonYear}
              </Button>
            </LinkContainer>
          )}
        </ButtonGroup>
      </div>
    );
  }
});

module.exports = UserEntries;
