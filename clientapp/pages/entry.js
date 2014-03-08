var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/bracket');
var BracketNav = require('../views/bracketNav');


module.exports = PageView.extend({
    template: templates.pages.entry,
    initialize: function () {
        this.listenTo(this.model, 'change:current', app.bracketNavigate);
    },
    render: function () {
        this.renderAndBind();

        this.renderSubview(new BracketView({
            model: this.model,
            pickable: true
        }), '[role=bracket]');

        this.renderSubview(new BracketNav({
            model: this.model
        }), '[role=bracket-nav]');
    }
});
