var HumanView = require('./base');
var templates = require('../templates');


module.exports = HumanView.extend({
    template: templates.includes.bracketNav,
    events: {
        'click a[role]': 'changeHistory',
        'affix.bs.affix': 'affixedTop'
    },
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        this.renderAndBind({model: this.model});
        this.$el.affix({
            offset: {
                top: app.view.$('[role=navigation]').outerHeight(true)
            }
        });
        return this;
    },
    changeHistory: function (e) {
        e.preventDefault();
        this.model[$(e.currentTarget).attr('role')]();
    }
});