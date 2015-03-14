let React = require('react');
let {PropTypes} = React;

let Affix = require('react-bootstrap/lib/Affix');

let Bracket = require('./Bracket');
let BracketNav = require('./Nav');
let BracketProgress = require('./Progress');
let ScoreCard = require('./ScoreCard');
let TweetButton = require('./TweetButton');


let BracketContainer = React.createClass({
    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        locked: PropTypes.bool.isRequired,
        history: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        bracket: PropTypes.string.isRequired,
        bracketObj: PropTypes.object.isRequired,
        entry: PropTypes.object
    },

    render () {
        return (
            <div>
                <div className='bracket-header'>
                    <Affix offsetTop={61}>
                        <BracketNav {...this.props} />
                        {!this.props.locked ? <TweetButton {...this.props} /> : null}
                        <BracketProgress {...this.props} />
                    </Affix>
                </div>
                {this.props.entry ? <ScoreCard {...this.props.entry} master={this.props.bracket} /> : null}
                <Bracket {...this.props} />
            </div>
        );
    }
});

module.exports = BracketContainer;
