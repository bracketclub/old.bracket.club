let React = require('react');

let Glyphicon = require('react-bootstrap/lib/Glyphicon');
let Button = require('react-bootstrap/lib/Button');
let Nav = require('react-bootstrap/lib/Nav');

let globalDataStore = require('../../stores/globalDataStore');
let bracketEntryActions = require('../../actions/bracketEntryActions');
let masterActions = require('../../actions/masterActions');


let BracketLink = React.createClass({
    handleClick (method) {
        let {locked} = globalDataStore.getState();

        let isGenerate = method.indexOf('generate-') === 0;
        let actions = locked ? masterActions : bracketEntryActions;

        if (isGenerate) {
            actions.generate(method.replace('generate-', ''));
        } else {
            actions[method]();
        }
    },
    render () {
        let onClick = this.handleClick.bind(null, this.props.method);
        return (
            <Button navItem componentClass='button' disabled={this.props.disabled} onClick={onClick}>
                {this.props.children ? this.props.children : <Glyphicon glyph={this.props.glyph} />}
            </Button>
        );
    }
});

let BracketNav = React.createClass({
    navProps () {
        let {history, index} = this.props;
        let hasHistory = history.length > 0;
        return {
            canRewind: hasHistory && index > 0,
            canFastForward: hasHistory && index < history.length - 1,
            canReset: history.length > 1
        };
    },
    render () {
        let {canRewind, canFastForward, canReset} = this.navProps();

        let items = [
            <BracketLink key={0} method='getFirst' glyph='fast-backward' disabled={!canRewind} />,
            <BracketLink key={1} method='getPrevious' glyph='step-backward' disabled={!canRewind} />,
            <BracketLink key={2} method='getNext' glyph='step-forward' disabled={!canFastForward} />,
            <BracketLink key={3} method='getLast' glyph='fast-forward' disabled={!canFastForward} />
        ];

        if (!this.props.locked) {
            items.push(
                <BracketLink key={4} method='reset' glyph='ban-circle' disabled={!canReset} />,
                <BracketLink key={5} method='generate-lower'>1</BracketLink>,
                <BracketLink key={6} method='generate-higher'>16</BracketLink>,
                <BracketLink key={7} method='generate-random' glyph='random' />
            );
        }

        return <Nav bsStyle="pills">{items}</Nav>;
    }
});

module.exports = BracketNav;
