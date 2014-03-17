var HumanView = require('./base');
var templates = require('../templates');
var track = require('../helpers/analytics');
var _ = require('underscore');


module.exports = HumanView.extend({
    template: templates.includes.bracketNav,
    events: {
        'click a[role]': 'triggerNavigation',
        'click [role=enter-button] a': 'enterBracket',
        'affix.bs.affix': 'affixedTop'
    },
    classBindings: {
        rewindClass: '[role=can-rewind]',
        fastForwardClass: '[role=can-fast-forward]',
        resetClass: '[role=can-reset]',
        isEnterable: ''
    },
    htmlBindings: {
        progressBar: '[role=progress-holder]',
        enterButton: '[role=enter-button]'
    },
    render: function () {
        this.listenTo(this.model, 'change:enterButton', this.setBracketPopover);
        this.renderAndBind({model: this.model});
        this.$el.affix({
            offset: {
                top: app.view.$('[role=navigation]').outerHeight(true)
            }
        });
        this.registerBindings(app.bracketLock, {
            htmlBindings: {
                timeToClose: '[role=time-to-close]'
            }
        });
        this.setBracketPopover();
        return this;
    },
    setBracketPopover: function () {
        _.defer(_.bind(function () {
            this.$('[role=enter-button] a').popover(!this.model.isEnterable ? 'destroy' : {
                html: true,
                placement: 'bottom',
                trigger: 'hover',
                content: templates.includes.enterPopover()
            });
        }, this));
    },
    triggerNavigation: function (e) {
        e.preventDefault();
        var eventName = $(e.currentTarget).attr('role');
        this.model[eventName]();
        track.bracketNavigation(eventName);
    },
    enterBracket: function () {
        track.enterBracket(this.model.current);
    }
});