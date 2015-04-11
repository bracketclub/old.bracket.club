'use strict';

let React = require('react');
let {PropTypes} = React;
let {PureRenderMixin} = require('react/addons').addons;

let Glyphicon = require('react-bootstrap/lib/Glyphicon');
let Button = require('react-bootstrap/lib/Button');
let ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
let ButtonGroup = require('react-bootstrap/lib/ButtonGroup');

let bracketEntryActions = require('../../actions/bracketEntryActions');
let masterActions = require('../../actions/masterActions');


let BracketNav = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        history: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        locked: PropTypes.bool.isRequired
    },

    getNavProps () {
        let {history, index} = this.props;
        let hasHistory = history.length > 0;
        return {
            canRewind: hasHistory && index > 0,
            canFastForward: hasHistory && index < history.length - 1,
            canReset: history.length > 1
        };
    },

    getNavActions () {
        return this.props.locked ? masterActions : bracketEntryActions;
    },

    handleGenerateClick (method) {
        this.getNavActions().generate(method);
    },

    handleHistoryClick (method) {
        this.getNavActions()[method]();
    },

    render () {
        let {canRewind, canFastForward, canReset} = this.getNavProps();
        let {locked} = this.props;
        let {handleGenerateClick: generate, handleHistoryClick: history} = this;

        let items = [
            <ButtonGroup key={0}>
                <Button disabled={!canRewind} onClick={history.bind(null, 'getFirst')}>
                    <Glyphicon glyph='fast-backward' />
                </Button>
                <Button disabled={!canRewind} onClick={history.bind(null, 'getPrevious')}>
                    <Glyphicon glyph='step-backward' />
                </Button>
                <Button disabled={!canFastForward} onClick={history.bind(null, 'getNext')}>
                    <Glyphicon glyph='step-forward' />
                </Button>
                <Button disabled={!canFastForward} onClick={history.bind(null, 'getLast')}>
                    <Glyphicon glyph='fast-forward' />
                </Button>
            </ButtonGroup>
        ];

        if (!locked) {
            items.push(
                <ButtonGroup key={1}>
                    <Button disabled={!canReset} onClick={history.bind(null, 'reset')}>
                        <Glyphicon glyph='ban-circle' />
                    </Button>
                    <Button onClick={generate.bind(null, 'lower')}>1</Button>
                    <Button onClick={generate.bind(null, 'higher')}>16</Button>
                    <Button onClick={generate.bind(null, 'random')}>
                        <Glyphicon glyph='random' />
                    </Button>
                </ButtonGroup>
            );
        }

        return <ButtonToolbar className='bracket-nav'>{items}</ButtonToolbar>;
    }
});

module.exports = BracketNav;
