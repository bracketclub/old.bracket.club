let React = require('react');
let {PropTypes} = React;
let {Link} = require('react-router');

let Alert = require('react-bootstrap/lib/Alert');
let TimeAgo = require('react-timeago');

let Bracket = require('./Bracket');
let BracketHeader = require('./Header');
let ScoreCard = require('./ScoreCard');

let bracketHelpers = require('../../helpers/bracket');

let formatter = (value, unit) => {
    if (value !== 1) unit += 's';
    return value + ' ' + unit;
};


let BracketContainer = React.createClass({
    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        locked: PropTypes.bool.isRequired,
        history: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        entry: PropTypes.object
    },

    getBracketObj () {
        let {entry, history, index, sport, year} = this.props;
        let bracket = history[index];
        let bracketHelper = bracketHelpers({sport, year});

        if (entry) {
            return bracketHelper.diff({master: bracket, entry: entry.bracket});
        }
        else {
            return bracketHelper.validate(bracket);
        }
    },

    render () {
        let {sport, year, entry, showEntryMessage, locked} = this.props;
        return (
            <div>
                <BracketHeader {...this.props} />
                {entry ? <ScoreCard {...this.props} {...entry} /> : null}
                {showEntryMessage || (entry && !locked) ?
                    <Alert bsStyle='info'>
                        Entries are still open for {year} for another <TimeAgo formatter={formatter} date={bracketHelpers({sport, year}).locks} />. 
                        Go to the <Link to='landing'>entry page</Link> to fill out your bracket before it's too late!
                    </Alert>
                    : 
                    null
                }
                <Bracket {...this.props} bracket={this.getBracketObj()} />
            </div>
        );
    }
});

module.exports = BracketContainer;
