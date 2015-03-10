let React = require('react');
let {PropTypes} = React;
let {PureRenderMixin} = require('react/addons').addons;

let Glyphicon = require('react-bootstrap/lib/Glyphicon');
let Button = require('react-bootstrap/lib/Button');
let Nav = require('react-bootstrap/lib/Nav');

let bracketEntryActions = require('../../actions/bracketEntryActions');
let masterActions = require('../../actions/masterActions');



let BracketLink = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        handleClick: PropTypes.func.isRequired,
        method: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        glyph: PropTypes.string
    },

    render () {
        let onClick = this.props.handleClick.bind(null, this.props.method);
        return (
            <Button navItem componentClass='button' disabled={this.props.disabled} onClick={onClick}>
                {this.props.children ? this.props.children : <Glyphicon glyph={this.props.glyph} />}
            </Button>
        );
    }
});

let BracketNav = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        history: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        locked: PropTypes.bool.isRequired
    },

    navProps () {
        let {history, index} = this.props;
        let hasHistory = history.length > 0;
        return {
            canRewind: hasHistory && index > 0,
            canFastForward: hasHistory && index < history.length - 1,
            canReset: history.length > 1
        };
    },

    handleGenerateClick (method) {
        let actions = this.props.locked ? masterActions : bracketEntryActions;
        actions.generate(method);
    },

    handleHistoryClick (method) {
        let actions = this.props.locked ? masterActions : bracketEntryActions;
        actions[method]();
    },

    render () {
        let {canRewind, canFastForward, canReset} = this.navProps();
        let {locked} = this.props;

        let items = [
            <BracketLink key={0} method='getFirst' glyph='fast-backward' disabled={!canRewind} handleClick={this.handleHistoryClick} />,
            <BracketLink key={1} method='getPrevious' glyph='step-backward' disabled={!canRewind} handleClick={this.handleHistoryClick} />,
            <BracketLink key={2} method='getNext' glyph='step-forward' disabled={!canFastForward} handleClick={this.handleHistoryClick} />,
            <BracketLink key={3} method='getLast' glyph='fast-forward' disabled={!canFastForward} handleClick={this.handleHistoryClick} />
        ];

        if (!locked) {
            items.push(
                <BracketLink key={4} method='reset' glyph='ban-circle' disabled={!canReset} handleClick={this.handleHistoryClick} />,
                <BracketLink key={5} method='lower' handleClick={this.handleGenerateClick}>1</BracketLink>,
                <BracketLink key={6} method='higher' handleClick={this.handleGenerateClick}>16</BracketLink>,
                <BracketLink key={7} method='random' glyph='random' handleClick={this.handleGenerateClick} />
            );
        }

        return <Nav bsStyle="pills">{items}</Nav>;
    }
});

module.exports = BracketNav;
