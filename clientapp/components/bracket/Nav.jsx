let React = require('react');

let Glyphicon = require('react-bootstrap/lib/Glyphicon');
let Button = require('react-bootstrap/lib/Button');
let Nav = require('react-bootstrap/lib/Nav');


let BracketLink = React.createClass({
    handleClick (method) {
        this.props.onGenerate(method);
    },
    render () {
        return (
            <Button onClick={this.handleClick.bind(null, this.props.method)} navItem componentClass='button'>
                {this.props.children ? this.props.children : <Glyphicon glyph={this.props.glyph} />}
            </Button>
        );
    }
});

let HistoryLink = React.createClass({
    handleClick (method) {
        this.props.onHistory(method);
    },
    render () {
        return (
            <Button onClick={this.handleClick.bind(null, this.props.method)} navItem componentClass='button' disabled={this.props.disabled}>
                <Glyphicon glyph={this.props.glyph} />
            </Button>
        );
    }
});

let BracketNav = React.createClass({
    render () {
        let items = [
            <HistoryLink {...this.props} method='getFirst' key={0} glyph='fast-backward' disabled={!this.props.canRewind} />,
            <HistoryLink {...this.props} method='getPrevious' key={1} glyph='step-backward' disabled={!this.props.canRewind} />,
            <HistoryLink {...this.props} method='getNext' key={2} glyph='step-forward' disabled={!this.props.canFastForward} />,
            <HistoryLink {...this.props} method='getLast' key={3} glyph='fast-forward' disabled={!this.props.canFastForward} />
        ];

        if (this.props.canEdit) {
            items.push(
                <HistoryLink {...this.props} key={4} method='resetHistory' glyph='ban-circle' disabled={!this.props.hasHistory} />,
                <BracketLink {...this.props} key={5} method='lower'>1</BracketLink>,
                <BracketLink {...this.props} key={6} method='higher'>16</BracketLink>,
                <BracketLink {...this.props} key={7} method='random' glyph='random' />
            );
        }

        return <Nav bsStyle="pills">{items}</Nav>;
    }
});

module.exports = BracketNav;
