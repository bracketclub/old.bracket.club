var HumanView = require('./base');
var templates = require('../templates');


module.exports = HumanView.extend({
    template: templates.includes.userBracketInfo,
    events: {
        'click [role=me-link]': 'toggleMe'
    },
    initialize: function () {
        this.listenTo(this.model.bracket, 'change:score', this.render);
    },
    textBindings: {
        meLink: '[role=me-link]'
    },
    render: function () {
        this.renderAndBind({user: this.model});
        return this;
    },

    derived: {
        meLink: {
            deps: ['isMe'],
            fn: function () {
                return this.isMe ? 'Not you?' : 'Is this you?';
            }
        },
    }

    toggleMe: function () {
        if (this.model.isMe) {
            app.logout();
        } else {
            me.username = this.model.username;
            app.localStorage('username', me.username);
        }
        this.model.randomHack = Math.random();
    }
});