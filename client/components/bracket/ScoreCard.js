'use strict';

const React = require('react');
const {PropTypes} = React;
const {PureRenderMixin} = require('react/addons').addons;
const {Link} = require('react-router');

const bracketHelpers = require('../../helpers/bracket');
const scoreTypes = ['standard', 'gooley', 'standardPPR', 'gooleyPPR'];

const ScoreCard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    sport: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    username: PropTypes.string,
    user_id: PropTypes.string,  // eslint-disable-line camelcase
    history: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    bracket: PropTypes.string.isRequired
  },

  render() {
    const {
      username,
      user_id: userId, // eslint-disable-line camelcase
      sport,
      year,
      history,
      index,
      bracket
    } = this.props;

    const score = bracketHelpers({sport, year}).score(scoreTypes, {master: history[index], entry: bracket});

    return (
      <div className='score-card'>
        {username && userId
          ? <h2>
            <Link to='userProfile' params={{id: userId}}>{username}</Link>
            <a className='twitter' href={`https://twitter.com/${username}`}>
              <img src='//g.twimg.com/Twitter_logo_blue.png' />
            </a>
          </h2>
          : null
        }
        <p>
          <strong>Total: </strong>{score.standard} – <strong>PPR: </strong>{score.standardPPR}<br/>
          <strong>Gooley: </strong>{score.gooley} – <strong>PPR: </strong>{score.gooleyPPR}
        </p>
      </div>
    );
  }
});

module.exports = ScoreCard;
