'use strict';

let React = require('react');
let {PropTypes} = React;
let classNames = require('classnames');

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
        index: PropTypes.number.isRequired
    },

    render () {
        let {locked} = this.props;
        let cx = classNames({
            'two-columns': locked,
            'three-columns': !locked
        });
        return (
            <div className={cx + ' bracket-header'}>
                <Affix offsetTop={51}>
                    <BracketNav {...this.props} />
                    {!this.props.locked ? <EnterButton {...this.props} /> : null}
                    <BracketProgress {...this.props} />
                </Affix>
            </div>
        );
    }
});

module.exports = BracketContainer;
