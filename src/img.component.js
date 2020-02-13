import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { getFilteredProps, processNode, server } from './utils';
import styles from './img.styles';
import LazyLoad from 'react-lazyload';


class Img extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cloudimgURL: '',
      sources: [],
      loaded: false,
      processed: false
    };
  }

  componentDidMount() {
    if (server) return;

    this.processImg();
  }

  componentDidUpdate(prevProps) {
    if (server) return;

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
    const data = processNode(this.props, imgNode, update, windowScreenBecomesBigger);

    this.setState(data);
  }

  onImgLoad = () => {
    this.setState({ loaded: true });
  }

  render() {
    const { config, src } = this.props;
    const { baseURL, placeholderBg, lazyLoading: configLazyLoadingValue } = config;
    const { lazyLoading = configLazyLoadingValue } = this.props;
    const {
      width, height, ratio, cloudimgURL, previewCloudimgURL, loaded, processed, previewLoaded, preview
    } = this.state;

    if (server) return <img src={baseURL + src}/>;
    if (!processed) return <div/>;

    const {
      alt, className, lazyLoadConfig, preserveSize, imgNodeWidth, imgNodeHeight, ...otherProps
    } = getFilteredProps(this.props);

    const picture = (
      <div
        className={`${className} cloudimage-image-wrapper cloudimage-image-${loaded ? 'loaded' : 'loading'}`}
        style={styles.picture({
          preserveSize, imgNodeWidth, imgNodeHeight, ratio, previewLoaded, loaded, placeholderBg
        })}
      >
        {preview &&
        <div style={styles.previewWrapper()}>
          <img
            style={styles.previewImg({ loaded, width })}
            src={previewCloudimgURL}
            alt="low quality preview image"
          />
        </div>}

        <img
          style={styles.img({ preview, loaded, width })}
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