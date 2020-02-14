import React, { Component } from 'react';
import { debounce } from 'throttle-debounce'


class ContainerBox extends Component {
  constructor() {
    super();

    this.box = React.createRef()
    this.state = {
      width: '---',
      height: '---'
    };
  }

  componentDidMount() {
    this.setState({
      width: this.box.current.parentNode.offsetWidth,
      height: this.box.current.parentNode.offsetHeight
    });

    window.addEventListener('resize', debounce(400, () => {
        this.setState({
          width: this.box.current.parentNode.offsetWidth,
          height: this.box.current.parentNode.offsetHeight
        });
      })
    );
  }

  render() {
    const { width, height } = this.state;
    const { isHeight } = this.props;

    return (
      <div
        ref={this.box}
        className="container-width-box"
      >
        container {isHeight ? '' : 'width:'} <span>{width}</span> {isHeight ? `x ${height}` : ''} px
      </div>
    )
  }
}

export default ContainerBox;