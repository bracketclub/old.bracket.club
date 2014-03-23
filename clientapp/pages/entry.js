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
        this.listenTo(app.bracketLock, 'change:isBefore', this.render);
    },
    render: function () {
        if (app.newUser) {
            app.newUser = false;
            this.registerSubview(new WelcomeModal().render());
        }

        if (!app.bracketLock.isBefore) {
            this.model = app.masters;
        }

        this.renderAndBind({
            fromEntry: this.fromEntry,
            isPickable: app.bracketLock.isBefore,
            bracket: this.model
        });

        this.setSubviews();
    },
    setSubviews: function () {
        this.bracketView = new BracketView({
            model: this.model,
            pickable: app.bracketLock.isBefore,
            el: this.getByRole('bracket')
        }).render();
        this.registerSubview(this.bracketView);

        this.bracketNav = new BracketNav({
            model: this.model,
            el: this.getByRole('bracket-nav')
        }).render();
        this.registerSubview(this.bracketNav);
    }
});
