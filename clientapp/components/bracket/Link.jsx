let React = require('react');
let {Glyphicon, Button} = require('react-bootstrap');
let {Navigation} = require('react-router');
let app = require('../../app');
let bracketGenerator = new (require('bracket-generator'))(app.sportYear);


let BracketLink = React.createClass({
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

module.exports = BracketLink;
