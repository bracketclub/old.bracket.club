var BaseView = require('./modal');
var templates = require('../templates');
var slugify = require('slug');
var uuid = require('node-uuid');


module.exports = BaseView.extend({
    template: templates.dialogs.collaborate,
    initialize: function () {
        this.updateUrl();
    },
    events: {
        'keydown [name=roomId]': 'updateUrl',
        'keyup [name=roomId]': 'updateUrl',
        'keypress [name=roomId]': 'updateUrl',
        'change [name=useLocal]': 'updateUrl',
        'submit form': 'submitForm'
    },
    updateUrl: function () {
        var roomName = this.$('[name=roomId]').val();
        var useLocal = this.$('[name=useLocal]').is(':checked');
        var localBracket;
        var url = '';

        if (roomName) {
            url += slugify(roomName);
        } else {
            url += uuid.v4();
        }

        if (useLocal) {
            localBracket = app.localBracket();
            url += localBracket ? '/' + localBracket : '';
        }

        this.collaborateUrl = url;
    },
    submitForm: function (e) {
        e.preventDefault();
        this.modal.modal('hide');
        app.navigate('/collaborate/' + this.collaborateUrl);
    }
});
