var PageView = require('./base');
var templates = require('../templates');
var ResultsRow = require('../views/resultsRow');
var BracketNav = require('../views/bracketNav');


module.exports = PageView.extend({
    pageTitle: 'Results',
    template: templates.pages.results,
    events: {
        'click [data-comparator]': 'changeComparator'
    },
    initialize: function () {
        // Resort when the model (the list of all masters) changes
        this.listenTo(this.model, 'change:current', function () {
            this.collection.sort();
        });
    },
    render: function () {
        this.renderAndBind({
            results: this.collection,
            masters: this.model
        });

        this.registerSubview(new BracketNav({
            model: this.model,
            el: this.getByRole('bracket-nav')
        }).render());

        this.renderCollection(this.collection, ResultsRow, this.getByRole('results'));
    },
    changeComparator: function (e) {
        e.preventDefault();
        this.collection.changeComparator($(e.currentTarget).data('comparator'));
    }
});
