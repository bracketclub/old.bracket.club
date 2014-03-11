var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/bracket');
var BracketNav = require('../views/bracketNav');


module.exports = PageView.extend({
    template: templates.pages.entry,
    htmlClass: 'bracket-page',
    initialize: function () {
        this.listenTo(this.model, 'change:current', app.bracketNavigate);
    },
    render: function () {
        this.renderAndBind();

        this.registerSubview(new BracketView({
            model: this.model,
            pickable: true,
            el: this.getByRole('bracket')
        }).render());

        this.registerSubview(new BracketNav({
            model: this.model,
            el: this.getByRole('bracket-nav')
        }).render());
    }
});
