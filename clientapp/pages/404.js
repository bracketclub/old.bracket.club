var PageView = require('./base');
var templates = require('../templates');


module.exports = PageView.extend({
    pageTitle: '404',
    template: templates.pages._404,
    initialize: function (options) {
        options || (options = {});
        this.message = options.message || '';
        this.text = options.text || '';
    },
    render: function () {
        this.renderAndBind({message: this.message, text: this.text});
    }
});
