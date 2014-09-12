/* globals twttr, Bloodhound */
var HumanView = require('./base');
var ViewSwitcher = require('human-view-switcher');
var _ = require('underscore');
var templates = require('../templates');
var CollabDialog = require('../modals/collaborate');
var SubscribeDialog = require('../modals/subscribe');
var track = require('../helpers/analytics');


module.exports = HumanView.extend({
    template: templates.body,
    initialize: function (options) {
        this.time = options.time;
    },
    events: {
        'click a[href]': 'handleLinkClick',
        'click a[role=collaborate]': 'handleCollaborateClick',
        'click a[role=logout]': 'handleLogoutClick',
        'click a[role=subscribe]': 'handleSubscribeClick',
        'typeahead:selected [role=username-search]': 'goToUser'
    },
    render: function () {
        this.listenTo(me, 'change:username change:pageLink', this.setUserNav);
        this.listenTo(app.bracketLock, 'change:isBefore', this.removeCollaborateLink);
        this.renderAndBind({
            me: me
        });
        this.registerBindings(this.time, {
            textBindings: {
                fromNow: '[role=last-updated]'
            },
            attributeBindings: {
                time: ['[role=last-updated]', 'title']
            }
        });
        this.addReferences({
            usernameSearch: '[role=username-search]',
            mainNavCollapse: '[role=main-nav-collapse]'
        });

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
        this.setUserTypeahead();
        this.removeCollaborateLink(app.bracketLock);

        return this;
    },
    removeCollaborateLink: function (model) {
        if (!model.isBefore) {
            this.$('[role=collaborate-nav-item]').remove();
        }
    },
    setPage: function (view) {
        // tell the view switcher to render the new one
        this.$('[role=username-search]').typeahead('val', '').trigger('blur');
        this.$mainNavCollapse.hasClass('in') && this.$mainNavCollapse.collapse('hide');
        this.pageSwitcher.set(view);
        track.pageview(window.location.pathname);
        typeof twttr !== 'undefined' && twttr.widgets.load();

        var readyEvent = document.createEvent("Event");
        readyEvent.initEvent("renderReady", true, true);
        window.dispatchEvent(readyEvent);
    },
    handleLinkClick: function (e) {
        var t = $(e.target);
        var $a = t.is('a') ? t : t.closest('a');
        var aEl = $a[0];
        var local = window.location.host === aEl.host;
        var path = $a.attr('href');
        var isKeyModified = e.metaKey || e.ctrlKey || e.shiftKey;

        t.parents('.dropdown-menu').prev().dropdown('toggle');

        // if the window location host and target host are the
        // same it's local, else, leave it alone
        if (local && !isKeyModified && path.charAt(0) !== '#') {
            app.navigate(path);
            return false;
        }
    },
    goToUser: function (e, user) {
        app.navigate('/user/' + user.username);
    },
    setUserTypeahead: function () {
        var source = new Bloodhound({
            name: 'users',
            local: window.bootstrap.entries,
            datumTokenizer: function (d) {
                return [d.username].concat(Bloodhound.tokenizers.whitespace(d.name));
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace
        });

        source.initialize();

        this.$usernameSearch.typeahead({
            minLength: 1,
            autoselect: true
        }, {
            name: 'users',
            displayKey: 'username',
            templates: {
                suggestion: function (suggestion) {
                    return templates.includes.typeaheadSuggestion(suggestion);
                }
            },
            source: source.ttAdapter()
        });
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
