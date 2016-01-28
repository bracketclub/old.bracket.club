import React, {Component, PropTypes} from 'react';
import {Glyphicon} from 'react-bootstrap';
import classNames from 'classnames';

export default class SortableTh extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    sortKey: PropTypes.string.isRequired,
    sortParams: PropTypes.object.isRequired,
    hideXs: PropTypes.bool,
    hideSm: PropTypes.bool
  };

  handleClick = (e) => {
    e.preventDefault();
    this.props.onClick(this.props.sortKey);
  };

  render() {
    const {sortKey, sortParams, hideXs, hideSm} = this.props;

    const active = sortKey === sortParams.key;
    const cx = classNames({
      active,
      'hidden-xs': hideXs,
      'hidden-sm': hideSm,
      'sortable-col': true
    });

    return (
      <th className={cx}>
        <a href='#' onClick={this.handleClick}>
          {this.props.children}
          {active &&
            <Glyphicon glyph={`chevron-${sortParams.dir === 'asc' ? 'up' : 'down'}`} />
          }
        </a>
      </th>
    );
  }
}
