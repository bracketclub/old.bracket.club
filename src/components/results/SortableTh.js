import React, {Component, PropTypes} from 'react';
import {Glyphicon} from 'react-bootstrap';
import classNames from 'classnames';

export default class SortableTh extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    sortKey: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    sortParams: PropTypes.object,
    hideXs: PropTypes.bool,
    hideSm: PropTypes.bool
  };

  handleClick = (e) => {
    e.preventDefault();
    const {onClick, sortKey} = this.props;
    if (onClick) onClick(sortKey);
  };

  render() {
    const {sortKey, sortParams, hideXs, hideSm} = this.props;
    const disabled = !sortParams;

    const active = !disabled && sortKey === sortParams.key;
    const aClasses = classNames({disabled});
    const thClasses = classNames({
      active,
      'hidden-xs': hideXs,
      'hidden-sm': hideSm
    });

    return (
      <th className={thClasses}>
        <a href='#' className={aClasses} onClick={this.handleClick}>
          {this.props.children}
          {active &&
            <Glyphicon glyph={`chevron-${sortParams.dir === 'asc' ? 'up' : 'down'}`} />
          }
        </a>
      </th>
    );
  }
}
