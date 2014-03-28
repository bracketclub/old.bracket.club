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
    initialize: function (options) {
        this.sortOptions = options.sortOptions;
        this.listenTo(this.sortOptions, 'change:sortBy change:order change:game', this.onSortOptions);

        this.model.historyIndex = this.sortOptions.game;
        // Resort when the model (the list of all masters) changes
        this.listenTo(this.model, 'change:current', function () {
            this.sortOptions.game = this.model.historyIndex;
        });

        this.listenTo(me, 'change:username', this.render);
        this.collection.changeComparatorAndSort(this.sortOptions.sortBy, this.sortOptions.order);
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
        this.sortOptions.setSortBy($(e.currentTarget).data('comparator'));
    },
    onSortOptions: function (options) {
        app.qsNavigate(options);
        this.collection.changeComparatorAndSort(options.sortBy, options.order);
    }
});
