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
    finalId: PropTypes.string,
    bracket: PropTypes.object,
    onUpdate: PropTypes.func
  };

  render() {
    const {bracket, onUpdate, finalId} = this.props;
    const common = {onUpdate, finalId};
    const borders = (<div className='final-round-borders' />);
    const bracketClasses = classNames('bracket', `has-scroll-${getScrollbarWidth()}`);

    if (!bracket) {
      return null;
    }

    if (bracket instanceof Error) {
      return (
        <Alert bsStyle='danger'>
          <h4>Whoa, something about that bracket doesn’t look right!</h4>
          <p>Could be that <strong>{bracket.message.toLowerCase().replace('.', '')}</strong>?</p>
        </Alert>
      );
    }

    return (
      <Row className={bracketClasses}>
        <Col md={6} className='region-side left-side'>
          {bracket.regions.left.map((region) => [
            <Region key={region.id} {...region} {...common} />,
            borders
          ])}
        </Col>

        <Col md={6} className='region-side right-side'>
          {bracket.regions.right.map((region) => [
            <Region key={region.id} {...region} {...common} />,
            borders
          ])}
        </Col>

        <Col md={12} className='final-region-container'>
          <Region {...bracket.regionFinal} {...common} final />
        </Col>
      </Row>
    );
  }
}
