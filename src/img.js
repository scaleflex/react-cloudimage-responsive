import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils.js';
import styles from './img.styles';
import LazyLoad from 'react-lazyload';


class Img extends Component {
  constructor(props) {
    super(props);

    this.server = isServer();
    this.state = {
      cloudimgURL: '',
      loaded: false,
      processed: false
    };
  }

  componentDidMount() {
    if (this.server) return;

    this.processImg();
  }

  componentDidUpdate(prevProps) {
    if (this.server) return;

    const { config: { innerWidth }, src } = this.props;

    if (prevProps.config.innerWidth !== innerWidth) {
      this.processImg(true, innerWidth > prevProps.config.innerWidth);
    }

    if (src !== prevProps.src) {
      this.processImg();
    }
  }

  processImg = (update, windowScreenBecomesBigger) => {
    const imgNode = findDOMNode(this);
    const data = processReactNode(this.props, imgNode, update, windowScreenBecomesBigger);

    this.setState(data);
  }

  onImgLoad = () => {
    this.setState({ loaded: true });
  }

  render() {
    const { config, src } = this.props;
    const { baseURL, placeholderBackground, lazyLoading: configLazyLoadingValue } = config;
    const { lazyLoading = configLazyLoadingValue } = this.props;
    const { height, ratio, cloudimgURL, previewCloudimgURL, loaded, processed, previewLoaded, preview } = this.state;

    if (this.server) return <img src={baseURL + src}/>;
    if (!processed) return <div/>;

    const {
      alt, className, lazyLoadConfig, preserveSize, imgNodeWidth, imgNodeHeight, ...otherProps
    } = getFilteredProps(this.props);

    const picture = (
      <div
        className={`${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`.trim()}
        style={styles.picture({
          preserveSize, imgNodeWidth, imgNodeHeight, ratio, previewLoaded, loaded, placeholderBackground
        })}
      >
        {preview &&
        <div style={styles.previewWrapper()}>
          <img
            style={styles.previewImg({ loaded })}
            src={previewCloudimgURL}
            alt="low quality preview image"
          />
        </div>}

        <img
          style={styles.img({ preview, loaded })}
          src={cloudimgURL}
          alt={alt}
          onLoad={this.onImgLoad}
          {...otherProps}
        />
      </div>
    );

    return lazyLoading ? (
      <LazyLoad height={height} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
        {picture}
      </LazyLoad>
    ) : picture;
  }
}


export default Img;