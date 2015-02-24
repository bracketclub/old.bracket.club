var State = require('ampersand-state');

module.exports = State.extend({
    getProps: function () {
        return this.getAttributes({session: true, props: true, derived: true});
    }
});
