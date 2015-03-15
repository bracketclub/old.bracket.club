let React = require('react');
let {PropTypes} = React;

let Bracket = require('./Bracket');
let BracketHeader = require('./Header');
let ScoreCard = require('./ScoreCard');


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
                <BracketHeader {...this.props} />
                {this.props.entry ? <ScoreCard {...this.props.entry} master={this.props.bracket} /> : null}
                <Bracket {...this.props} />
            </div>
        );
    }
});

module.exports = BracketContainer;
