let React = require('react');
let {State} = require('react-router');

let Bracket = require('../views/bracket');
let BracketNav = require('../views/bracketNav');
let BracketProgress = require('../views/bracketProgress');

let app = require('../app');
let BracketModel = require('../models/liveBracket');
let bracket = new BracketModel(app.sportYear);


module.exports = React.createClass({
    mixins: [State],
    render () {
        bracket.current = this.getParams().bracket || app.data.constants.EMPTY;
        console.log(bracket.current);
        var data = bracket.getAttributes({session: true, props: true, derived: true});
        return (<div>
            <BracketNav {...data} canEdit={true} />
            <BracketProgress {...data}  />
            <Bracket {...data}  />
        </div>);
    }
});
