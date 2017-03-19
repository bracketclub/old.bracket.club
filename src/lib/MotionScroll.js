import React, {PropTypes, Component, cloneElement, Children} from 'react';
import {debounce} from 'lodash';
import {Motion, spring} from 'react-motion';

const DEBOUNCE_MS = 50;
const SCROLL_REF = 'scroller';
const CONTROLLED_FLAG = '_componentIsScrolling';

// The scroller does two things:

// 1. Set the scrollLeft position on the dom node whenever the component
// updates with props like {scroll: NUM, animate: true}
//
// 2. Assigns a scroll listener to the dom node and reports to the parent
// whenver the node is scrolled by the user so that react-motion's state
// can be reset for future animations
//
// All scroll listeners are debounced by the DEBOUNCE_MS constant
class Scroller extends Component {
  static propTypes = {
    scroll: PropTypes.number.isRequired,
    animate: PropTypes.bool.isRequired,
    onScrollReset: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired
  };

  componentDidMount() {
    this.refs[SCROLL_REF].addEventListener('scroll', this.handleScroll, false);
  }

  componentDidUpdate(prevProps) {
    const {scroll, animate} = this.props;

    if (!animate || scroll === prevProps.scroll) {
      return;
    }

    this.startScrolling();
    this.refs[SCROLL_REF].scrollLeft = scroll;
    this.endScrolling();
  }

  componentWillUnmount() {
    this.refs[SCROLL_REF].removeEventListener('scroll', this.handleScroll, false);
  }

  handleScroll = debounce((e) => {
    // Do nothing if the node is being controlled by componentDidUpdate
    if (this[CONTROLLED_FLAG]) return;
    this.props.onScrollReset(e.target.scrollLeft);
  }, DEBOUNCE_MS);

  startScrolling() {
    this[CONTROLLED_FLAG] = true;
  }

  endScrolling = debounce(() => {
    // Reset the controlled flag so that user interactions are listened fro again
    this[CONTROLLED_FLAG] = false;
  }, DEBOUNCE_MS);

  render() {
    const {children} = this.props;
    return cloneElement(Children.only(children), {ref: SCROLL_REF});
  }
}

export default class MotionScroll extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    scroll: PropTypes.number.isRequired,
    onScrollReset: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {scroll: 0, animate: false};
  }

  componentWillReceiveProps(nextProps) {
    const {scroll} = nextProps;
    if (scroll !== this.state.scroll) {
      // Respond to prop updates by setting the internal scroll state
      this.setState({scroll, animate: true});
    }
  }

  handleScrollReset = (scroll) => {
    // Reset the internal scroll state with animate false so nothing is animated
    this.setState({scroll, animate: false});
    // Also report to this parent in case it needs to reset its state
    const {onScrollReset} = this.props;
    if (onScrollReset) {
      onScrollReset(scroll);
    }
  };

  render() {
    const {children} = this.props;
    const {animate, scroll} = this.state;

    // During animations it uses react-motions spring, otherwise it is just
    // resetting internal state of <Motion>
    const scrollStyle = animate ? spring(scroll) : scroll;

    return (
      <Motion defaultStyle={{scroll: 0}} style={{scroll: scrollStyle}}>
        {(value) =>
          <Scroller onScrollReset={this.handleScrollReset} scroll={value.scroll} animate={animate}>
            {children}
          </Scroller>
        }
      </Motion>
    );
  }
}

