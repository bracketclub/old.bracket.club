let React = require('react');
let {Glyphicon, Button, Nav} = require('react-bootstrap');
let BracketLink = require('./Link');


let GlyphButton = React.createClass({
    render () {
        return (
            <Button navItem componentClass='button' disabled={this.props.disabled}>
                <Glyphicon glyph={this.props.glyph} />
            </Button>
        );
    }
});

module.exports = React.createClass({
    render () {
        let items = [
            <GlyphButton glyph='fast-backward' disabled={!this.props.canRewind} />,
            <GlyphButton glyph='step-backward' disabled={!this.props.canRewind} />,
            <GlyphButton glyph='step-forward' disabled={!this.props.canFastForward} />,
            <GlyphButton glyph='fast-forward' disabled={!this.props.canFastForward} />
        ];

        if (this.props.canEdit) {
            items.push(
                <GlyphButton glyph='ban-circle' disabled={!this.props.hasHistory} />,
                <BracketLink type='lower'>1</BracketLink>,
                <BracketLink type='higher'>16</BracketLink>,
                <BracketLink type='random' glyph='random' />
            );
        }

        return <Nav bsStyle="pills">{[items]}</Nav>;
    }
});
