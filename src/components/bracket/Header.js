import React, {PropTypes, Component, Children} from 'react';
import {Affix} from 'react-overlays';
import cx from 'classnames';

export default class BracketHeader extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const {children} = this.props;
    const childrenCount = Children.count(children);

    const classnames = cx({
      'three-columns': childrenCount === 3,
      'two-columns': childrenCount === 2
    });

    return (
      <div className={`bracket-header ${classnames}`}>
        <Affix offsetTop={56} affixClassName='affix'>
          <div>
            {children}
          </div>
        </Affix>
      </div>
    );
  }
}
