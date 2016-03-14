import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import {Row, Col, Alert} from 'react-bootstrap';

import getScrollbarWidth from 'lib/scrollbarWidth';
import Region from './Region';

export default class Bracket extends Component {
  static defaultProps = {
    bracket: {}
  };

  static propTypes = {
    bracket: PropTypes.object,
    onUpdate: PropTypes.func
  };

  render() {
    const {bracket, onUpdate} = this.props;
    const common = {onUpdate};
    const borders = (<div className='final-round-borders' />);
    const bracketClasses = classNames('bracket', `has-scroll-${getScrollbarWidth()}`);

    if (!bracket) {
      return null;
    }

    if (bracket instanceof Error) {
      return (
        <Alert bsStyle='danger'>
          <h4>Whoa, something about that bracket doesn't look right!</h4>
          <p>Could be that <strong>{bracket.message.toLowerCase().replace('.', '')}</strong>?</p>
        </Alert>
      );
    }

    return (
      <Row className={bracketClasses}>
        <Col md={6} className='region-side left-side'>
          <Region {...bracket.region1} {...common} />
          {borders}
          <Region {...bracket.region2} {...common} />
          {borders}
        </Col>

        <Col md={6} className='region-side right-side'>
          <Region {...bracket.region3} {...common} />
          {borders}
          <Region {...bracket.region4} {...common} />
          {borders}
        </Col>

        <Col md={12} className='final-region-container'>
          <Region {...bracket.regionFinal} {...common} final />
        </Col>
      </Row>
    );
  }
}
