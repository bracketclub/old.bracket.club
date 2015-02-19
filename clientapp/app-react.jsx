var React = require('react');
var Bracket = require('./react/bracket');
var BracketNav = require('./react/bracketNav');
var BracketProgress = require('./react/bracketProgress');
var BracketModel = require('./models/liveBracket');
var bracket = new BracketModel({
    sport: 'ncaa-mens-basketball',
    year: '2014'
});


window.render = function () {
    var data = bracket.getAttributes({session: true, props: true, derived: true});
    React.render((<div>
        <BracketNav {...data} canEdit={true} />
        <BracketProgress {...data}  />
        <Bracket {...data}  />
    </div>), document.body);
};


require('domready')(function () {
    window.render();
    window.bracket = bracket;
    bracket.on('change', window.render);
});
