var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/bracket');
var UserInfo = require('../views/userBracketInfo');
var BracketNav = require('../views/bracketNav');


module.exports = PageView.extend({
    pageTitle: function () {
        return this.model.username;
    },
    htmlClass: 'bracket-page',
    template: templates.pages.user,
    initialize: function (options) {
        this.masters = options && options.masters;
    },
    render: function () {
        this.renderAndBind();

        this.registerSubview(new BracketView({
            model: this.model.bracket,
            pickable: false,
            el: this.getByRole('bracket')
        }).render());

        this.registerSubview(new UserInfo({
            model: this.model,
            el: this.getByRole('user-info')
        }).render());

        this.registerSubview(new BracketNav({
            model: this.masters,
            el: this.getByRole('bracket-nav')
        }).render());
    }
});
