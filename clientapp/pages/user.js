var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/userBracket');


module.exports = PageView.extend({
    pageTitle: 'user',
    template: templates.pages.home,
    render: function () {
        this.renderAndBind();
        this.renderSubview(new BracketView({
            model: this.model
        }), '.bracket');
    }
});
