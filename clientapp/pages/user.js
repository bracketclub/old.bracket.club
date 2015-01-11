var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/bracket');
var UserInfo = require('../views/userBracketInfo');
var BracketNav = require('../views/bracketNav');


module.exports = PageView.extend({
    template: templates.pages.user,
    subviews: {
        bracket: {
            hook: 'bracket',
            prepareView: function (el) {
                return new BracketView({
                    el: el,
                    model: this.model.bracket,
                });
            }
        },
        userInfo: {
            hook: 'user-info',
            prepareView: function (el) {
                return new UserInfo({
                    el: el,
                    model: this.model,
                });
            }
        },
        bracketNav: {
            hook: 'bracket-nav',
            prepareView: function (el) {
                return new BracketNav({
                    el: el,
                    model: app.masters,
                });
            }
        }
    },
    initialize: function () {
        this.listenToAndRun(this.model, 'change:username', function () {
            this.pageTitle = this.model.username;
        });

        app.htmlClass = 'bracket-page';
    }
});
