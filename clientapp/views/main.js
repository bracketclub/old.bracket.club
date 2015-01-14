var _ = require('underscore');
var dom = require('ampersand-dom');
var MainView = require('ampersand-main-view');
var templates = require('../templates');
var CollabDialog = require('../modals/collaborate');
var SubscribeDialog = require('../modals/subscribe');
var track = require('../helpers/analytics');
var UserTypeahead = require('./userTypeahead');
var router = require('../router');


module.exports = MainView.extend({
    template: templates.body,

    props: {
        htmlClass: 'string',
        pageTitle: 'string',
        me: 'state',
        locked: 'state'
    },

    subviews: {
        userTypeahead: {
            hook: 'username-search',
            prepareView: function (el) {
                return new UserTypeahead({
                    el: el,
                    collection: app.entries
                });
            }
        }
    },

    bindings: {
        // ME
        'me.username': [{
            type: 'text',
            hook: 'username'
        }, {
            type: 'toggle',
            hook: 'user-nav'
        }],
        'me.pageLink': {
            type: 'attribute',
            name: 'href',
            hook: 'user-link'
        },

        // LOCKED
        'locked.isBefore': {
            type: 'toggle',
            hook: 'collaborate-nav-item'
        },
        'locked.fromNow': {
            type: 'text',
            hook: 'last-updated'
        },
        'locked.time': {
            type: 'attribute',
            name: 'title',
            hook: 'last-updated'
        },

        pageTitle: {
            type: function (el, value) {
                document.title = value || this.model.name;
            }
        },
        htmlClass: {
            type: function (el, value, previous) {
                var html = el.parentNode;
                dom.addClass(html, value);
                dom.removeClass(html, previous);
            }
        }
    },

    pageRegion: '[data-hook=page-container]',
    navRegion: '[data-hook=main-nav]',
    router: router,

    events: function () {
        return _.extend({
            'click a[role=collaborate]': 'handleCollaborateClick',
            'click a[role=logout]': 'handleLogoutClick',
            'click a[role=subscribe]': 'handleSubscribeClick'
        }, MainView.prototype.events);
    },

    render: function () {
        this.renderWithTemplate();
        this.cacheJQueryElements({
            mainCollapseNav: '[data-hook=main-collapse-nav]'
        });
    },

    updatePage: function () {
        document.body.scrollTop = 0;
        MainView.prototype.updatePage.apply(this, arguments);
        track.pageview(window.location.pathname);
        this.userTypeahead.reset();
        this.collapseNav();
        twttr.widgets.load();
        this.triggerRenderEvent();
    },

    collapseNav: function () {
        var $el = this.$mainCollapseNav;
        if ($el.hasClass('in')) {
            $el.collapse('hide');
        }
        $el.find('.dropdown.open .dropdown-toggle').dropdown('toggle');
    },

    triggerRenderEvent: function () {
        var readyEvent = document.createEvent("Event");
        readyEvent.initEvent("renderReady", true, true);
        window.dispatchEvent(readyEvent);
    },

    handleLogoutClick: function () {
        app.logout();
    },
    handleCollaborateClick: function (e) {
        e.preventDefault();
        this.registerSubview(new CollabDialog().render());
    },
    handleSubscribeClick: function (e) {
        e.preventDefault();
        this.registerSubview(new SubscribeDialog().render());
    }
});
