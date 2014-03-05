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
    render: function () {
        this.renderAndBind({
            results: this.collection,
            masters: this.model
        });

        this.renderSubview(new BracketNav({
            model: this.model
        }), '[role=bracket-nav]');

        this.renderCollection(this.collection, ResultsRow, this.getByRole('results'));
        this.listenTo(this.model, 'change:current', function () { this.collection.sort(); });
    },
    changeComparator: function (e) {
        e.preventDefault();
        this.collection.changeComparator($(e.currentTarget).data('comparator'));
    }
});
