var BaseView = require('./modal'),
    _ = require('underscore'),
    templates = require('../templates'),
    slugify = function (txt) {
        return txt.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    };

module.exports = BaseView.extend({
    template: templates.dialogs.collaborate,
    events: {
        'click [data-dismiss]': 'hideModal',
        'submit form': 'submitForm'
    },
    submitForm: function (e) {
        e.preventDefault();
        var url = '/collaborate' + (this.$('[type=checkbox]').is(':checked') ? '-set' : '') + '/' + slugify(this.$('input').val());
        this.modal.modal('hide');
        app.navigate(url);
    }
});
