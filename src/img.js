import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { BASE_64_PLACEHOLDER } from 'cloudimage-responsive-utils/dist/constants';
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

    const { config: { delay } } = this.props;

    if (typeof delay !== 'undefined') {
      setTimeout(() => {
        this.processImg();
      }, delay);
    } else {
      this.processImg();
    }
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

  onPreviewLoaded = (event) => {
    if (this.state.previewLoaded) return;

    this.updateLoadedImageSize(event.target);
    this.setState({ previewLoaded: true });
  }

  updateLoadedImageSize = image => {
    this.setState({
      loadedImageWidth: image.naturalWidth,
      loadedImageHeight: image.naturalHeight,
      loadedImageRatio: image.naturalWidth / image.naturalHeight
    })
  }

  onImgLoad = (event) => {
    this.updateLoadedImageSize(event.target);
    this.setState({ loaded: true });
  }

  render() {
    const { config = {} } = this.props;
    const { placeholderBackground, lazyLoading: configLazyLoadingValue } = config;
    const { lazyLoading = configLazyLoadingValue } = this.props;
    const {
      height, ratio, cloudimgURL, cloudimgSRCSET, previewCloudimgURL, loaded, processed, previewLoaded, preview,
      loadedImageRatio, operation
    } = this.state;

    if (this.server) return <img alt={this.props.alt} src={BASE_64_PLACEHOLDER}/>;
    if (!processed) return <div/>;

    const {
      alt, className, lazyLoadConfig, preserveSize, imgNodeWidth, imgNodeHeight, ...otherProps
    } = getFilteredProps(this.props);

    const picture = (
      <div
        className={`${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`.trim()}
        style={styles.picture({
          preserveSize,
          imgNodeWidth,
          imgNodeHeight,
          ratio: ratio || loadedImageRatio,
          previewLoaded,
          loaded,
          placeholderBackground,
          operation
        })}
      >
        {(preview && operation !== 'bound') &&
        <div style={styles.previewWrapper()}>
          <img
            style={styles.previewImg({ loaded, operation })}
            src={previewCloudimgURL}
            alt="low quality preview image"
            onLoad={this.onPreviewLoaded}
          />
        </div>}

        <img
          alt={alt}
          style={styles.img({ preview, loaded, operation })}
          {...otherProps}
          src={cloudimgURL}
          onLoad={this.onImgLoad}
          {...(cloudimgSRCSET && { srcSet: cloudimgSRCSET.map(({ dpr, url }) => `${url} ${dpr}x`).join(', ') })}
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