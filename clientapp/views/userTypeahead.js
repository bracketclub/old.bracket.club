/* globals Bloodhound */
var View = require('./base');


module.exports = View.extend({
    events: {
        'typeahead:selected': 'goToUser'
    },
    render: function () {
        var source = new Bloodhound({
            name: 'users',
            local: this.collection.toJSON(),
            datumTokenizer: function (d) {
                return [d.username].concat(Bloodhound.tokenizers.whitespace(d.name));
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace
        });

        source.initialize();

        this.$el.typeahead({
            minLength: 1,
            autoselect: true
        }, {
            name: 'users',
            displayKey: 'username',
            templates: {
                suggestion: function (suggestion) {
                    return '<span>' + suggestion.username + '</span>';
                }
            },
            source: source.ttAdapter()
        });
    },
    reset: function () {
        this.$el.typeahead('val', '').trigger('blur');
    },
    goToUser: function (e, user) {
        app.navigate('/user/' + user.username);
    }
});
