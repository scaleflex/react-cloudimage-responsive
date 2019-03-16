import React, { Component } from 'react';
import { debounce } from 'throttle-debounce'

class ContainerBox extends Component {
  constructor() {
    super();

    this.box = React.createRef()
    this.state = {
      width: '---'
    };
  }

  componentDidMount() {
    this.setState({
      width: this.box.current.offsetWidth
    });

    window.onresize = debounce(400, () => {
      this.setState({
        width: this.box.current.offsetWidth
      });
    })
  }

  render() {
    return (
      <div
        ref={this.box}
        className="container-width-box"
      >
        container width: <span>{this.state.width}</span> px
      </div>
    )
  }
}

export default ContainerBox;