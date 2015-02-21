var BaseView = require('./modal');
var templates = require('../templates');


module.exports = BaseView.extend({
    template: templates.dialogs.subscribe,
    events: {
        'submit form': 'hideModal'
    },
    hideModal: function () {
        this.modal.modal('hide');
    }
});
