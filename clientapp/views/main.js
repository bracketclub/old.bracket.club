var HumanView = require('./base');
var ViewSwitcher = require('human-view-switcher');
var _ = require('underscore');
var templates = require('../templates');
var setFavicon = require('favicon-setter');
var CollabDialog = require('../modals/collaborate');
var WelcomeModal = require('../modals/wtf');


module.exports = HumanView.extend({
    template: templates.body,
    initialize: function () {},
    events: {
        'click a[href]': 'handleLinkClick',
        'click a[role="collaborate"]': 'handleCollaborateClick'
    },
    render: function () {
        this.renderAndBind({me: me});

        this.listenTo(me, 'change', this.renderUserNav);

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

        this.welcomeModal();

        setFavicon('/favicon.ico');
        return this;
    },
    renderUserNav: function () {

    },
    setPage: function (view) {
        // tell the view switcher to render the new one
        this.pageSwitcher.set(view);
    },
    handleLinkClick: function (e) {
        var t = $(e.target);
        var aEl = t.is('a') ? t[0] : t.closest('a')[0];
        var local = window.location.host === aEl.host;
        var path = aEl.pathname.slice(1);
        var isKeyModified = e.metaKey || e.ctrlKey || e.shiftKey;

        // if the window location host and target host are the
        // same it's local, else, leave it alone
        if (local && !isKeyModified) {
            app.navigate(path);
            return false;
        }
    },
    handleCollaborateClick: function (e) {
        e.preventDefault();
        this.registerSubview(new CollabDialog().render());
    },
    welcomeModal: function () {
        if (app.localStorage('isNewUser') !== false) {
            this.registerSubview(new WelcomeModal().render());
        }
    }
});
