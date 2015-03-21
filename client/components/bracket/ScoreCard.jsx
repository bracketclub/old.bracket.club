let React = require('react');
let {PropTypes} = React;
let {PureRenderMixin} = require('react/addons').addons;
let {Link} = require('react-router');

let bracketHelpers = require('../../helpers/bracket');
let scoreTypes = ['standard', 'gooley', 'standardPPR', 'gooleyPPR'];


let ScoreCard = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        username: PropTypes.string,
        user_id: PropTypes.string,
        history: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        bracket: PropTypes.string.isRequired
    },

    render () {
        let {username, user_id, sport, year, history, index, bracket} = this.props;
        let score = bracketHelpers({sport, year}).score(scoreTypes, {master: history[index], entry: bracket});

        return (
            <div className='score-card'>
                {username && user_id ?
                    <h2>
                        <Link to='userProfile' params={{id: user_id}}>{username}</Link> 
                        <a className='twitter' href={'https://twitter.com/' + username}>
                            <img src='//g.twimg.com/Twitter_logo_blue.png' />
                        </a>
                    </h2>
                    :
                    null
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
