let React = require('react');
let {PropTypes} = React;
let {PureRenderMixin} = require('react/addons').addons;

let bracketHelpers = require('../../helpers/bracket');
let scoreTypes = ['standard', 'gooley', 'standardPPR', 'gooleyPPR'];


let ScoreCard = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        master: PropTypes.string.isRequired,
        bracket: PropTypes.string.isRequired
    },

    render () {
        let {username, sport, year, master, bracket} = this.props;
        let score =  bracketHelpers({sport, year}).scorer(scoreTypes, {master, bracket});

        return (
            <div className='score-card'>
                <h2>
                    {username} 
                    <a className='twitter' href={'https://twitter.com/' + username}>
                        <img src='https://g.twimg.com/Twitter_logo_blue.png' />
                    </a>
                </h2>
                <p>
                    <strong>Total: </strong> - {score.standard} - <strong>PPR: </strong> - {score.standardPPR}<br/>
                    <strong>Gooley: </strong>{score.gooley} - <strong>PPR: </strong> - {score.gooleyPPR}
                </p>
            </div>
        );
    }
});

module.exports = ScoreCard;
