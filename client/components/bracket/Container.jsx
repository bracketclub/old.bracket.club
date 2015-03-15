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
        bracket: PropTypes.string.isRequired,
        bracketObj: PropTypes.object.isRequired,
        master: PropTypes.string,
        entry: PropTypes.object
    },

    render () {
        let {sport, year, master, entry, isLiveEntry, locked} = this.props;
        return (
            <div>
                <BracketHeader {...this.props} />
                {entry ?
                    <ScoreCard {...entry} sport={sport} year={year} master={master} />
                    :
                    null
                }
                {isLiveEntry && !locked ?
                    <Alert bsStyle='info'>
                        Entries are still open for {year} for another <TimeAgo formatter={formatter} date={bracketHelpers({sport, year}).locks} />. 
                        Go to the <Link to='landing'>entry page</Link> to fill out your bracket before it's too late!
                    </Alert>
                    : 
                    null
                }
                <Bracket {...this.props} locked={isLiveEntry ? true : locked} />
            </div>
        );
    }
});

module.exports = BracketContainer;
