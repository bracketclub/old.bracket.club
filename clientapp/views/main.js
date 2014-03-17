/* globals twttr */
var HumanView = require('./base');
var ViewSwitcher = require('human-view-switcher');
var _ = require('underscore');
var templates = require('../templates');
var setFavicon = require('favicon-setter');
var CollabDialog = require('../modals/collaborate');
var SubscribeDialog = require('../modals/subscribe');
var track = require('../helpers/analytics');


module.exports = HumanView.extend({
    template: templates.body,
    initialize: function () {},
    events: {
        'click a[href]': 'handleLinkClick',
        'click a[role=collaborate]': 'handleCollaborateClick',
        'click a[role=logout]': 'handleLogoutClick',
        'click a[role=subscribe]': 'handleSubscribeClick'
    },
    render: function () {
        this.listenTo(me, 'change:username change:pageLink', this.setUserNav);
        this.listenTo(app.bracketLock, 'change:isPickable', this.removeCollaborateLink);
        this.renderAndBind({me: me});

        this.pageSwitcher = new ViewSwitcher(this.getByRole('page-container'), {
            show: function (newView) {
                document.title = _.result(newView, 'pageTitle') || "Tweet Your Bracket";
                var $html = $('html');
                $html.removeClass(function (index, className) {
                    if (className.indexOf('html-') === 0) {
                        $(this).removeClass(className);
                    }
                });
                if (newView.htmlClass) {
                    $html.addClass('html-' + newView.htmlClass);
                }
                document.scrollTop = 0;
                app.currentPage = newView;
            }
        });

        this.setUserNav(me);
        this.removeCollaborateLink(app.bracketLock);

        setFavicon('/favicon.ico');
        return this;
    },
    removeCollaborateLink: function (model) {
        if (!model.isPickable) {
            this.$('[role=collaborate-nav-item]').remove();
        }
    },
    setPage: function (view) {
        // tell the view switcher to render the new one
        this.pageSwitcher.set(view);
        track.pageview(window.location.pathname);
        typeof twttr !== 'undefined' && twttr.widgets.load();
    },
    handleLinkClick: function (e) {
        var t = $(e.target);
        var aEl = t.is('a') ? t[0] : t.closest('a')[0];
        var local = window.location.host === aEl.host;
        var path = aEl.pathname.slice(1);
        var isKeyModified = e.metaKey || e.ctrlKey || e.shiftKey;

        t.parents('.dropdown-menu').prev().dropdown('toggle');

        // if the window location host and target host are the
        // same it's local, else, leave it alone
        if (local && !isKeyModified) {
            app.navigate(path);
            return false;
        }
    },
    setUserNav: function (model) {
        var $userNav = this.$('[role=user-nav]');
        if (!model.username) {
            $userNav.remove();
        } else {
            if (!$userNav.length) {
                this.$('[role=main-nav]').append(this.template.me(me));
            } else {
                $userNav.replaceWith(this.template.me(me));
            }

            this.$('[role=user-nav]').children('a').dropdown();
        }
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
