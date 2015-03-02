let React = require('react');

let Glyphicon = require('react-bootstrap/lib/Glyphicon');
let Button = require('react-bootstrap/lib/Button');
let Nav = require('react-bootstrap/lib/Nav');

let bracketActions = require('../../actions/bracketActions');


let BracketLink = React.createClass({
    handleClick (method) {
        let isGenerate = method.indexOf('generate') === 0;
        if (isGenerate) {
            bracketActions.generate(method.replace('generate', '').toLowerCase());
        } else {
            bracketActions[method]();
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
            <BracketLink method='getFirst' key={0} glyph='fast-backward' disabled={!canRewind} />,
            <BracketLink method='getPrevious' key={1} glyph='step-backward' disabled={!canRewind} />,
            <BracketLink method='getNext' key={2} glyph='step-forward' disabled={!canFastForward} />,
            <BracketLink method='getLast' key={3} glyph='fast-forward' disabled={!canFastForward} />
        ];

        if (!this.props.locked) {
            items.push(
                <BracketLink key={4} method='reset' glyph='ban-circle' disabled={!canReset} />,
                <BracketLink key={5} method='generateLower'>1</BracketLink>,
                <BracketLink key={6} method='generateHigher'>16</BracketLink>,
                <BracketLink key={7} method='generateRandom' glyph='random' />
            );
        }

        return <Nav bsStyle="pills">{items}</Nav>;
    }
});

module.exports = BracketNav;
