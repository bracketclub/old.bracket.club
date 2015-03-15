let React = require('react');
let {PropTypes} = React;
let {classSet} = require('react/addons').addons;

let Affix = require('react-bootstrap/lib/Affix');

let BracketProgress = require('./Progress');
let EnterButton = require('./EnterButton');
let BracketNav = require('./Nav');


let BracketContainer = React.createClass({
    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        locked: PropTypes.bool.isRequired,
        history: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        bracket: PropTypes.string.isRequired
    },

    render () {
        let {locked} = this.props;
        let cx = classSet({
            'two-columns': locked,
            'three-columns': !locked
        });
        return (
            <div className={cx + ' bracket-header'}>
                <Affix offsetTop={51}>
                    <BracketNav {...this.props} />
                    {this.props.locked ? null : <EnterButton {...this.props} />}
                    <BracketProgress {...this.props} />
                </Affix>
            </div>
        );
    }
});

module.exports = BracketContainer;
