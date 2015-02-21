let React = require('react');
let {Glyphicon} = require('react-bootstrap');
let {Navigation} = require('react-router');
let app = require('../app');
let bracketGenerator = new (require('bracket-generator'))(app.sportYear);

let GeneratorButton = React.createClass({
    mixins: [Navigation],
    onClick (event) {
        event.preventDefault();
        this.replaceWith('bracket', {bracket: bracketGenerator.generate(this.props.type)});
    },
    render () {
        return (<li><button className='btn' href='#' onClick={this.onClick}>{this.props.children}</button></li>);
    }
});

let DisabledButton = React.createClass({
    render () {
        return (
            <li><button className='btn' disabled={this.props.disabled}>
                <Glyphicon glyph={this.props.glyph} />
            </button></li>
        );
    }
});

module.exports = React.createClass({
    render () {
        let items = [
            <DisabledButton glyph='fast-backward' disabled={!this.props.canRewind} />,
            <DisabledButton glyph='step-backward' disabled={!this.props.canRewind} />,
            <DisabledButton glyph='step-forward' disabled={!this.props.canFastForward} />,
            <DisabledButton glyph='fast-forward' disabled={!this.props.canFastForward} />
        ];

        if (this.props.canEdit) {
            items.push(
                <DisabledButton glyph='ban-circle' disabled={!this.props.hasHistory} />,
                <GeneratorButton type='lower'>1</GeneratorButton>,
                <GeneratorButton type='higher'>16</GeneratorButton>,
                <GeneratorButton type='random'><Glyphicon glyph='random' /></GeneratorButton>
            );
        }

        return (<ul className='nav nav-pills navbar-left'>{[items]}</ul>);
    }
});
