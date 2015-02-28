let React = require('react');
let {State,RouteHandler} = require('react-router');
let {Header, Footer} = require('./components');


let App = React.createClass({
    mixins: [State],
    getHandlerKey () {
        var key = this.getRoutes()[1].name;
        var id = this.getParams().id;
        if (id) { key += id; }
        return key || 'root';
    },
    useFluidContainer () {
        var key = this.getHandlerKey();
        return !!key.match(/^(emptyBracket|bracket|root|user)$/i);
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
