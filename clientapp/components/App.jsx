let React = require('react');
let {State, RouteHandler} = require('react-router');

let Header = require('./Header');
let Footer = require('./Footer');

let rFluidContainer = /^(bracket|root|user|user\d*)$/i;


let App = React.createClass({
    mixins: [State],
    getHandlerKey () {
        var key = this.getRoutes()[1].name;
        var id = this.getParams().id;
        if (id) key += id;
        return key || 'root';
    },
    useFluidContainer () {
        return !!this.getHandlerKey().match(rFluidContainer);
    },
    render () {
        return (
            <div>
                <Header {...this.props} />
                <div className={this.useFluidContainer() ? 'container-fluid' : 'container'}>
                    <RouteHandler />
                    <Footer {...this.props} />
                </div>
            </div>
        );
    }
});

module.exports = App;
