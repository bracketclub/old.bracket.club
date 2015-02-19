var React = require('react');
var cx = require('react/lib/cx');

var NavItem = React.createClass({
    render () {
        var classes = {
            glyphicon: true
        };
        classes['glyphicon-' + this.props.iconClass] = !!this.props.iconClass;
        return (
            <li>
                <button className="btn" disabled={this.props.disabled}>{
                    this.props.text ? this.props.text : <span className={cx(classes)}></span>
                }</button>
            </li>
        );
    }
});

module.exports = React.createClass({
    render () {
        var items = [
            <NavItem iconClass={'fast-backward'} disabled={this.props.canRewind} />,
            <NavItem iconClass={'step-backward'} disabled={this.props.canRewind} />,
            <NavItem iconClass={'step-forward'} disabled={this.props.canFastForward} />,
            <NavItem iconClass={'fast-forward'} disabled={this.props.canFastForward} />
        ];

        if (this.props.canEdit) {
            items.push(
                <NavItem iconClass={'ban-circle'} disabled={this.props.hasHistory} />,
                <NavItem text={'1'} />,
                <NavItem text={'16'} />,
                <NavItem iconClass={'random'} /> 
            );
        }

        return (<ul className="nav nav-pills navbar-left">{[items]}</ul>);
    }
});
