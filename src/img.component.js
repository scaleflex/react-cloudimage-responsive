import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import {
  checkIfRelativeUrlPath,
  determineContainerProps,
  generateURL,
  getAdaptiveSize,
  getBreakPoint,
  getImgSrc,
  getParams,
  isImageSVG,
  isServer,
  getFilteredProps
} from './utils';
import LazyLoad from 'react-lazyload';


class Img extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cloudimageURL: '',
      sources: [],
      isLoaded: false,
      isProcessed: false
    }
  }

  componentDidMount() {
    if (isServer) return;

    this.processImage();
  }

  componentDidUpdate(prevProps) {
    if (isServer) return;

    const { config: { innerWidth }, src } = this.props;

    if (prevProps.config.innerWidth !== innerWidth) {
      this.processImage(true, innerWidth > prevProps.config.innerWidth);
    }

    if (src !== prevProps.src) {
      this.processImage();
    }
  }

  processImage = (isUpdate, isInnerWidthBigger) => {
    const {
      src: imageNodeSRC = '',
      width: imageNodeWidth = null,
      height: imageNodeHeight = null,
      ratio: imageNodeRatio,
      params: imageNodeParams,
      config = {},
      sizes,
      lazyLoading = config.lazyLoading
    } = this.props;
    const imgNode = findDOMNode(this);
    const isRelativeUrlPath = checkIfRelativeUrlPath(imageNodeSRC);
    const src = getImgSrc(imageNodeSRC, isRelativeUrlPath, config.baseURL);
    const isSVG = isImageSVG(src);
    const params = getParams(imageNodeParams);
    const isAdaptive = !!sizes;
    let containerProps;
    let isPreview = false;
    let cloudimageURL, previewCloudimageURL;

    if (isAdaptive) {
      const adaptiveSizes = getAdaptiveSize(sizes, config);
      const size = getBreakPoint(adaptiveSizes);
      containerProps = determineContainerProps({
        imgNode,
        config,
        imageNodeWidth,
        imageNodeHeight,
        imageNodeRatio,
        params,
        size
      });
      const { width, height } = containerProps;

      isPreview = width > 400;

      cloudimageURL = generateURL({ src, params, config, width, height });

      if (isPreview) {
        previewCloudimageURL = this.getPreviewSRC(width, height, params, src);
      }
    } else {
      if (isUpdate && !isInnerWidthBigger) return;

      containerProps = determineContainerProps({
        imgNode,
        config,
        imageNodeWidth,
        imageNodeHeight,
        imageNodeRatio,
        params
      });
      const { width, height } = containerProps;
      isPreview = width > 400 && !isSVG;

      cloudimageURL = isSVG ? src : generateURL({ src, params, config, width, height });

      if (isPreview) {
        previewCloudimageURL = this.getPreviewSRC(width, height, params, src);
      }
    }

    this.setState({
      cloudimageURL,
      previewCloudimageURL,
      isProcessed: true,
      isPreview,
      lazyLoading,
      ...containerProps
    });
  }

  getPreviewSRC = (width, height, params, src) => {
    const { config } = this.props;
    const { previewQualityFactor } = config;
    const previewParams = { ...params, ci_info: '' };
    const previewWidth = Math.floor(width / previewQualityFactor);
    const previewHeight = Math.floor(height / previewQualityFactor);

    return generateURL({
      src,
      config,
      params: previewParams,
      width: previewWidth,
      height: previewHeight
    });
  }

  onImageLoad = () => {
    const { isPreviewLoaded, isPreview } = this.state;

    if (!isPreview) {
      this.setState({ isPreviewLoaded: true, isLoaded: true });
    } else if (isPreviewLoaded)
      this.setState({ isLoaded: true });
    else
      this.setState({ isPreviewLoaded: true });
  }

  render() {
    if (isServer) return <img src={this.props.config.baseURL + this.props.src}/>;

    const {
      cloudimageURL, isLoaded, width, height, isProcessed, isPreviewLoaded, previewCloudimageURL, isPreview, ratio,
      lazyLoading
    } = this.state;
    const { alt, className, config, lazyLoadConfig, preserveSize, imageNodeWidth, imageNodeHeight, ...otherProps } =
      getFilteredProps(this.props);
    const { placeholderBackground, imgLoadingAnimation } = config;

    if (!isProcessed) return <picture/>;

    const picture = (
      <picture
        className={`${className} cloudimage-image-picture cloudimage-image-${isLoaded ? 'loaded' : 'loading'}`}
        style={styles.picture({
          preserveSize, imageNodeWidth, imageNodeHeight, ratio, isPreviewLoaded, isLoaded, placeholderBackground
        })}
      >
        <img
          style={styles.img({ ratio, imgLoadingAnimation, width, isLoaded })}
          src={!isPreview ? cloudimageURL : (isPreviewLoaded ? cloudimageURL : previewCloudimageURL)}
          alt={alt}
          onLoad={this.onImageLoad}
          {...otherProps}
        />
      </picture>
    );

    return lazyLoading ? (
      <LazyLoad height={height} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
        {picture}
      </LazyLoad>
    ) : picture;
  }
}

const styles = {
  picture: ({ preserveSize, imageNodeWidth, imageNodeHeight, ratio, isPreviewLoaded, isLoaded, placeholderBackground }) => ({
    display: 'inline-block',
    width: preserveSize && imageNodeWidth ? imageNodeWidth : '100%',
    height: preserveSize && imageNodeHeight ? imageNodeHeight : 'auto',
    paddingBottom: preserveSize ? 'none' : (100 / ratio) + '%',
    overflow: 'hidden',
    position: 'relative',
    background: (!isPreviewLoaded && !isLoaded) ? placeholderBackground : 'transparent'
  }),

  img: ({ ratio, imgLoadingAnimation, width, isLoaded, isPreview }) => ({
    ...{
      display: 'block',
      width: '100%',
    },
    ...(ratio ? styles.imgWithRatio : {}),
    ...(imgLoadingAnimation ? { ...styles.imgWithEffect, filter: `blur(${Math.floor(width / 100)}px)` } : {}),
    ...(isLoaded && imgLoadingAnimation ? styles.imgLoaded : {}),
    ...((isPreview && ratio) ? { height: '100%' } : {})
  }),

  imgWithRatio: {
    position: 'absolute',
    opacity: 1,
    top: 0,
    left: 0,
    height: 'auto'
  },

  imgWithEffect: {
    transform: 'scale3d(1.1, 1.1, 1)',
    transition: 'all 0.3s ease-in-out'
  },

  imgLoading: {
    opacity: 1
  },

  imgLoaded: {
    opacity: 1,
    filter: 'blur(0px)',
    transform: 'translateZ(0) scale3d(1, 1, 1)'
  }
};

export default Img;