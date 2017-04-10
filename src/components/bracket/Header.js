import React, {Component, Children} from 'react';
import PropTypes from 'prop-types';
import {Affix} from 'react-overlays';
import classNames from 'classnames';

const THREE_COLUMNS = 3;
const TWO_COLUMNS = 2;

export default class BracketHeader extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const {children} = this.props;
    const childrenCount = Children.count(children);

    const headerClasses = classNames('bracket-header', {
      'three-columns': childrenCount === THREE_COLUMNS,
      'two-columns': childrenCount === TWO_COLUMNS
    });

    return (
      <div className={headerClasses}>
        <Affix offsetTop={56} affixClassName='affix'>
          <div>
            {children}
          </div>
        </Affix>
      </div>
    );
  }
}
