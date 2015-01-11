var _ = require('underscore');
var inherits = require('inherits');
var delegateEventSplitter = /^(\S+)\s*(.*)$/;


module.exports = function (SuperView) {
    function JQueryView(attrs) {
        SuperView.apply(this, arguments);
        // Since $el is a derived property we cant rely on ampersand-view's
        // internal _handleElementChange since that will delegate events
        // before `$el` is set and we use it during delegation
        this.on('change:$el', this._handleJQElementChange, this);
        if (attrs.el && !this.autoRender) {
            this._handleJQElementChange();
        }
    }

    inherits(JQueryView, SuperView);
    JQueryView.extend = SuperView.extend;

    return JQueryView.extend({
        cacheJQueryElements: function (obj) {
            _.each(obj, function (selector, key) {
                this['$' + key] = this.$(selector);
            }, this);
        },
        $: function (selector) {
            return $(selector, this.el);
        },
        // This is for finding all matching jquery
        // elements including the root el
        $root: function (selector) {
            var matches = this.$.call(this, selector);
            if ($(this.el).is(selector)) {
                matches = matches.add(this.el);
            }
            return matches;
        },
        derived: {
            '$el': {
                deps: ['el'],
                fn: function () {
                    if (this.el) {
                        return $(this.el);
                    }
                }
            },
            delegateEventNamespace: {
                deps: ['cid'],
                fn: function () {
                    return '.delegate-events-' + this.cid;
                }
            }
        },

        // Since we are handling event delegation on `change:$el` now,
        // the only thing we have to do on `change:el` is apply bindings
        _handleElementChange: function () {
            this._applyBindingsForKey();
            return this;
        },

        // Currently the only thing that we need to do when our
        // $el is ready/changed is delegate events
        _handleJQElementChange: function () {
            this.delegateEvents();
            return this;
        },

        // `events-mixin` used by `ampersand-view` isn't compatible with
        // `jQuery.fn.trigger` so we use our own delegate fn that uses
        // jQuery's event system instead
        delegateEvents: function (events) {
            if (!(events || (events = _.result(this, 'events')))) return this;
            this.undelegateEvents();
            for (var key in events) {
              var method = this[events[key]];
              if (!method) continue;

              var match = key.match(delegateEventSplitter);
              var eventName = match[1] + this.delegateEventNamespace;
              var selector = match[2];

              method = _.bind(method, this);

              if (selector === '') {
                this.$el.on(eventName, method);
              } else {
                this.$el.on(eventName, selector, method);
              }
            }
            return this;
        },
        undelegateEvents: function () {
            this.$el.off(this.delegateEventNamespace);
            return this;
        }
    });
};