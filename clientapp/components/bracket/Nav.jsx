let React = require('react');
let {Glyphicon, Button, Nav} = require('react-bootstrap');
let {Navigation} = require('react-router');
let app = require('../../app');
let bracketGenerator = new (require('bracket-generator'))(app.sportYear);


let GeneratorButton = React.createClass({
    mixins: [Navigation],
    onClick (event) {
        event.preventDefault();
        this.replaceWith('bracket', {bracket: bracketGenerator.generate(this.props.type)});
    },
    render () {
        return (
            <Button navItem componentClass='button' onClick={this.onClick}>
                {this.props.glyph ? <Glyphicon glyph={this.props.glyph} /> : this.props.children}
            </Button>
        );
    }
});

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
                <GeneratorButton type='lower'>1</GeneratorButton>,
                <GeneratorButton type='higher'>16</GeneratorButton>,
                <GeneratorButton glyph='random' type='random' />
            );
        }

        return (<Nav bsStyle="pills">{[items]}</Nav>);
    }
});
