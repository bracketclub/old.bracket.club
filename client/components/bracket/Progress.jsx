let React = require('react');
let {PropTypes} = React;
let {PureRenderMixin} = require('react/addons').addons;

let ProgressBar = require('react-bootstrap/lib/ProgressBar');
let bracketHelpers = require('../../helpers/bracket');


let BracketProgress = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        locked: PropTypes.bool.isRequired,
        bracket: PropTypes.string.isRequired
    },

    render () {
        let {sport, year, locked, bracket} = this.props;
        let {totalGames, unpickedChar} = bracketHelpers({sport, year});
        let progress = totalGames - (bracket.split(unpickedChar).length - 1);
        let label = "%(now)s of %(max)s " + (locked ? 'games played' : 'picks made');

        return <div className='bracket-progress'><ProgressBar striped now={progress} min={0} max={totalGames} label={label} /></div>;
    }
});

module.exports = BracketProgress;
