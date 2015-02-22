let React = require('react');
let {State} = require('react-router');

let Bracket = require('../components/bracket/Bracket');
let BracketNav = require('../components/bracket/Nav');
let BracketProgress = require('../components/bracket/Progress');

let app = require('../app');
let BracketModel = require('../models/liveBracket');
let bracket = new BracketModel(app.sportYear);


module.exports = React.createClass({
    mixins: [State],
    render () {
        bracket.current = this.getParams().bracket || app.data.constants.EMPTY;
        var data = bracket.getAttributes({session: true, props: true, derived: true});
        return (<div>
            <BracketNav {...data} canEdit={true} />
            <BracketProgress {...data}  />
            <Bracket {...data}  />
        </div>);
    }
});
