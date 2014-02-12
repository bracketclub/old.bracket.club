var PageView = require('./base');
var templates = require('../templates');


module.exports = PageView.extend({
    pageTitle: '404',
    template: templates.pages._404,
    initialize: function (options) {
        options || (options = {});
        this.message = options.message || '';
    },
    render: function () {
        this.renderAndBind(this.message);
    }
});
