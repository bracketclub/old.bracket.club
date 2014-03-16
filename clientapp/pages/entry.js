var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/bracket');
var BracketNav = require('../views/bracketNav');
var WelcomeModal = require('../modals/wtf');


module.exports = PageView.extend({
    template: templates.pages.entry,
    htmlClass: 'bracket-page',
    initialize: function (options) {
        this.fromEntry = options.fromEntry;
        this.listenTo(this.model, 'change:current', app.bracketNavigate);
    },
    render: function () {
        if (app.newUser) {
            app.newUser = false;
            this.registerSubview(new WelcomeModal().render());
        }

        this.renderAndBind({fromEntry: this.fromEntry});

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
