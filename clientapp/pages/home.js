var PageView = require('./base');
var templates = require('../templates');
var _ = require('underscore');
var BracketView = require('../views/bracket');


module.exports = PageView.extend({
    pageTitle: 'home',
    template: templates.pages.home,
    initialize: function () {
        this.listenTo(this.model, 'change:ordered', this.updateUrl);
    },
    render: function () {
        this.renderAndBind();
        this.renderSubview(new BracketView({
            model: this.model
        }), '.bracket');
        this.updateUrl();
    },
    updateUrl: function () {
        app.navigate('/bracket/' + this.model.current, {trigger: false, replace: true});
    }
});
