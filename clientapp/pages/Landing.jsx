let React = require('react');
let {State} = require('react-router');

let Entry = require('../components/Entry');
let FourOhFour = require('./FourOhFour');
let Master = require('../components/Master');

let {rYear} = require('../global');
let bracketHelpers = require('../helpers/bracket');


module.exports = React.createClass({
    mixins: [State],

    getInitialState () {
        return {bracket: this.getParams().path};
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    render () {
        let {locked, sport, year} = this.props;
        let {bracket} = this.state;
        let {regex} = bracketHelpers({sport, year});

        // The landing page is a few things dependent on state & url:

        // 1) A previous completed year
        // 2) The current locked year
        if (locked || (bracket && rYear.test(bracket))) {
            return <Master {...this.props} bracket={bracket} />;
        }

        // 3) A fallback url which will render the 404
        if (bracket && !regex.test(bracket)) {
            return <FourOhFour />;
        }

        // 4) The current unlocked entry
        return <Entry {...this.props} bracket={bracket} />;
    }
});
