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

        // A locked master bracket for a previous year
        if (locked && rYear.test(bracket)) {
            return <Master {...this.props} />;
        }

        // The current unlocked entry for the current year
        if (!locked && rYear.test(bracket)) {
            return <Entry {...this.props} />;
        }

        // A fallback url which will render the 404 for bad params
        if (bracket && !regex.test(bracket)) {
            return <FourOhFour />;
        }

        // The current unlocked entry
        return <Entry {...this.props} bracket={bracket} />;
    }
});
