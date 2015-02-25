let React = require('react');
let {State, Navigation} = require('react-router');

let Bracket = require('../components/bracket/Container');
let BracketModel = require('../models/bracket');
let app = require('../app');


module.exports = React.createClass({
    mixins: [State, Navigation],
    getInitialState () {
        return this.getParams();
    },
    componentWillReceiveProps () {
        this.setState(this.getParams());
    },
    onBracketChange (bracket) {
        this.replaceWith('bracket', {bracket: bracket.current});
    },
    render () {
        return (<Bracket
            canEdit={true}
            onBracketChange={this.onBracketChange}
            bracketProps={{current: this.state.bracket || app.data.constants.EMPTY}}
            bracketConstructor={BracketModel}
        />);
    }
});
