var BaseView = require('./modal');
var templates = require('../templates');
var slugify = require('../helpers/slugify');


module.exports = BaseView.extend({
    template: templates.dialogs.collaborate,
    events: {
        'click [data-dismiss]': 'hideModal',
        'submit form': 'submitForm'
    },
    submitForm: function (e) {
        e.preventDefault();
        var url = '/collaborate/' + slugify(this.$('input').val());
        this.modal.modal('hide');
        app.navigate(url);
    }
});
