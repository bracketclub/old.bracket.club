let React = require('react');
let {State} = require('react-router');

let Entry = require('../components/Entry');
let FourOhFour = require('./FourOhFour');
let Master = require('../components/Master');

let bracketHelpers = require('../helpers/bracket');


module.exports = React.createClass({
    mixins: [State],

    getInitialState () {
        return {bracket: this.props.bracket};
    },

    componentWillReceiveProps (props) {
        this.setState({bracket: props.bracket});
    },

    render () {
        let {locked, sport, year} = this.props;
        let {bracket} = this.state;
        let {regex} = bracketHelpers({sport, year});


        if (locked || (bracket && /20\d\d/.test(bracket))) {
            return <Master {...this.props} bracket={bracket} />;
        }

        else if (bracket && !regex.test(bracket)) {
            return <FourOhFour />;
        }

        else {
            return <Entry {...this.props} bracket={bracket} />;
        }
    }
});
