var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/bracket');
var UserInfo = require('../views/userBracketInfo');
var BracketNav = require('../views/bracketNav');


module.exports = PageView.extend({
    pageTitle: 'user',
    template: templates.pages.user,
    initialize: function (options) {
        this.masters = options && options.masters;
    },
    render: function () {
        this.renderAndBind();

        this.renderSubview(new BracketView({
            model: this.model.bracket,
            pickable: false
        }), this.getByRole('bracket'));

        this.renderSubview(new UserInfo({
            model: this.model
        }), this.getByRole('user-info'));

        this.renderSubview(new BracketNav({
            model: this.masters
        }), this.getByRole('bracket-nav'));
    }
});
