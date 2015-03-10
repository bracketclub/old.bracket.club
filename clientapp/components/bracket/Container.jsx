let React = require('react');
let {PropTypes} = React;

let Bracket = require('./Bracket');
let BracketNav = require('./Nav');
let BracketProgress = require('./Progress');
let ScoreCard = require('./ScoreCard');


let BracketContainer = React.createClass({
    propTypes: {
        locked: PropTypes.bool.isRequired,
        history: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        bracket: PropTypes.string.isRequired,
        bracketObj: PropTypes.object.isRequired,
        entry: PropTypes.object
    },

    render () {
        return (<div>
            <BracketNav {...this.props} />
            <BracketProgress {...this.props}/>
            {this.props.entry ? <ScoreCard {...this.props.entry} master={this.props.bracket} /> : null}
            <Bracket {...this.props} />
        </div>);
    }
});

module.exports = BracketContainer;
