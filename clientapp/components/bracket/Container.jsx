let React = require('react');
let extend = require('lodash/object/extend');

let Bracket = require('./Bracket');
let BracketNav = require('./Nav');
let BracketProgress = require('./Progress');
let ScoreCard = require('./ScoreCard');

let app = require('../../app');



module.exports = React.createClass({
    componentWillMount () {
        this.bracket = new this.props.bracketConstructor(extend({},
            app.sportYear,
            this.props.bracketProps
        ));
    },
    getInitialState () {
        return this.props.bracketProps;
    },
    componentWillReceiveProps (nextProps) {
        this.setState(nextProps.bracketProps);
    },
    setStateFromBracket () {
        let {current, history, historyIndex} = this.bracket;
        this.props.onBracketChange({current, history, historyIndex}, this.bracket);
    },

    onHistory (method) {
        this.bracket[method]();
        this.setStateFromBracket();
    },
    onGenerate (method) {
        this.bracket.generate(method);
        this.setStateFromBracket();
    },
    onUpdateGame (data) {
        this.bracket.updateGame(data);
        this.setStateFromBracket();
    },

    render () {
        let bracket = this.bracket.set(this.state).getProps();
        return (<div>
            <BracketNav {...bracket} canEdit={this.props.canEdit} onHistory={this.onHistory} onGenerate={this.onGenerate} />
            <BracketProgress {...bracket}  />
            {!this.props.canEdit ? <ScoreCard {...bracket} {...this.props.user} /> : null}
            <Bracket {...bracket} canEdit={this.props.canEdit} onUpdateGame={this.onUpdateGame} />
        </div>);
    }
});
