import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'react-bootstrap';
import SyncContainer from '../containers/Sync';

export default class Page extends Component {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    sync: PropTypes.object,
    children: PropTypes.node.isRequired
  };

  getColumnWidths = () => {
    const {width} = this.props;

    // The default width is full size on small screens and below
    // and centered at 2/3 of the screen above that
    if (!width) {
      return {
        sm: 12,
        lg: 8,
        lgOffset: 2
      };
    }

    if (width === 'full') {
      return {xs: 12};
    }

    return width;
  };

  render() {
    const {
      children,
      width,
      sync = {}
    } = this.props;

    return (
      <Grid fluid={width === 'full'} style={{paddingBottom: '50px', minHeight: '300px'}}>
        <Row>
          <Col {...this.getColumnWidths()}>
            <SyncContainer sync={sync}>{children}</SyncContainer>
          </Col>
        </Row>
      </Grid>
    );
  }
}
