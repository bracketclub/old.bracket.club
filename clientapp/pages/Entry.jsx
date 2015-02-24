let React = require('react');
let {State, Navigation} = require('react-router');

let ReplaceBracket = require('../mixins/replaceBracket');

let Bracket = require('../components/bracket/Bracket');
let BracketNav = require('../components/bracket/Nav');
let BracketProgress = require('../components/bracket/Progress');

let app = require('../app');
let BracketModel = require('../models/liveBracket');
let bracket = new BracketModel(app.sportYear);


module.exports = React.createClass({
    mixins: [State, Navigation, ReplaceBracket],
    getStateFromStore () {
        return {
            bracket: this.getParams().bracket || app.data.constants.EMPTY
        };
    },
    getInitialState () {
        return this.getStateFromStore();
    },
    componentWillReceiveProps () {
        this.setState(this.getStateFromStore());
    },
    handleUpdate (data) {
        bracket.updateGame(data);
        this.replaceBracket(bracket.current);
    },
    handleHistory (method) {
        bracket[method]();
        this.replaceBracket(bracket.current);
    },
    handleGenerate (method) {
        bracket.generate(method);
        this.replaceBracket(bracket.current);
    },
    render () {
        bracket.current = this.state.bracket;
        var props = bracket.getProps();
        return (<div>
            <BracketNav {...props} canEdit={true} onHistory={this.handleHistory} onGenerate={this.handleGenerate} />
            <BracketProgress {...props}  />
            <Bracket {...props} onUpdateGame={this.handleUpdate} />
        </div>);
    }
});
