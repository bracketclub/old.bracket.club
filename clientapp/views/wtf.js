var BaseView = require('./modal'),
    _ = require('underscore'),
    templates = require('../templates');


module.exports = BaseView.extend({
    template: templates.dialogs.wtf,
    events: {
        'click [data-dismiss]': 'hideModal'
    },
    onModalHidden: function () {
        app.localStorage('isNewUser', false);
        BaseView.prototype.onModalHidden.apply(this, arguments);
    },
});
