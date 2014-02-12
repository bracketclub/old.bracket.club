var BaseView = require('./modal'),
    _ = require('underscore'),
    templates = require('../templates');


module.exports = BaseView.extend({
    template: templates.dialogs.enter,
});
