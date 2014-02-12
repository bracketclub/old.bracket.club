var PageView = require('./base');
var templates = require('../templates');
var _ = require('underscore');
var ResultsRow = require('../views/resultsRow');


module.exports = PageView.extend({
    pageTitle: 'results',
    template: templates.pages.results,
    events: {
        'click [role=nav] a': 'changeHistory',
        'click th[role]': 'changeComparator'
    },
    initialize: function () {
    },
    render: function () {
        this.renderAndBind({results: this.collection});
        this.renderCollection(this.collection, ResultsRow, this.getByRole('results'));
    },
    changeHistory: function (e) {
        e.preventDefault();
        this.collection[$(e.currentTarget).attr('role')]();
        this.getByRole('nav').innerHTML = this.template.nav(this.collection);
    },
    changeComparator: function (e) {
        var $target = $(e.currentTarget),
            role = $target.attr('role');

        if (role === 'gooley') {
            this.collection.comparator = this.collection.byGooley;

        } else {
            this.collection.comparator = this.collection.byTotal;
        }
        $target.siblings().filter('.active, .info').addClass('active').removeClass('info');
        $target.removeClass('active').addClass('info');
        this.collection.sort();
    }
});
