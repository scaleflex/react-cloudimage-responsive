import React, { Component } from 'react';
import { getPresets } from './utils';
import { debounce } from 'throttle-debounce';


export const CloudimageContext = React.createContext();


class CloudimageProvider extends Component {
  constructor({ config = {} }) {
    super();

    const {
      token = '',
      container = 'cloudimg.io',
      ultraFast = false,
      lazyLoading = true,
      imgLoadingAnimation = true,
      lazyLoadOffset = 100,
      width = '400',
      height = '300',
      operation = 'width',
      filters = 'n',
      placeholderBackground = '#f4f4f4',
      baseUrl = '/',
      presets,
      queryString = ''
    } = config;

    this.state = {
      token,
      container,
      ultraFast,
      lazyLoading,
      imgLoadingAnimation,
      lazyLoadOffset,
      width,
      height,
      operation,
      filters,
      placeholderBackground,
      baseUrl,
      presets: presets ? getPresets(presets, 'presets') :
        {
          xs: 575,  // up to 576    PHONE
          sm: 767,  // 577 - 768    PHABLET
          md: 991,  // 769 - 992    TABLET
          lg: 1199, // 993 - 1200   SMALL_LAPTOP_SCREEN
          xl: 3000  // from 1200    USUALSCREEN
        },
      order: presets ? getPresets(presets, 'order') : ['xl', 'lg', 'md', 'sm', 'xs'],
      queryString,
      innerWidth: window.innerWidth,
      //isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    };

    window.addEventListener("resize", this.updateDimensions);
  }

  updateDimensions = debounce(100, () => {
    const { innerWidth } = this.state;

    if (innerWidth < window.innerWidth)
      this.setState({ innerWidth: window.innerWidth });
  })

  render() {
    return (
      <CloudimageContext.Provider value={{ config: this.state }}>
        {this.props.children}
      </CloudimageContext.Provider>
    )
  }
}

export default CloudimageProvider;