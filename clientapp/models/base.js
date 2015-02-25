let State = require('ampersand-state');


module.exports = State.extend({
    getProps () {
        return this.getAttributes({session: true, props: true, derived: true});
    }
});
