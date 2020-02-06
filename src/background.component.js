import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import {
  checkIfRelativeUrlPath,
  determineContainerProps,
  generateURL,
  getAdaptiveSize,
  getBreakPoint, getFilteredProps,
  getImgSrc,
  getParams,
  isImageSVG,
  isServer
} from './utils';
import LazyLoad from 'react-lazyload';


class BackgroundImg extends Component {
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

    this.processBackground();
  }

  componentDidUpdate(prevProps) {
    if (isServer) return;

    const { config: { innerWidth }, src } = this.props;

    if (prevProps.config.innerWidth !== innerWidth) {
      this.processBackground(true, innerWidth > prevProps.config.innerWidth);
    }

    if (src !== prevProps.src) {
      this.processBackground();
    }
  }

  processBackground = (isUpdate, isInnerWidthBigger) => {
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
    const backgroundNode = findDOMNode(this);
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
        imgNode: backgroundNode,
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
        imgNode: backgroundNode,
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

  onImageLoad = () => {
    const { isPreview, isPreviewLoaded } = this.state;

    if (!isPreview) {
      this.setState({ isPreviewLoaded: true, isLoaded: true });
    } else if (isPreviewLoaded) {
      this.setState({ isLoaded: true });
    } else
      this.setState({ isPreviewLoaded: true });
  }

  getBackgroundURL = () => {
    const { isPreview, isLoaded, cloudimageURL, isPreviewLoaded, previewCloudimageURL } = this.state;

    if (isLoaded) return cloudimageURL;
    if (isPreviewLoaded) return previewCloudimageURL;

    if (isPreview) {
      let tempOriginalImage = new Image();
      let tempPreviewImage = new Image();

      tempOriginalImage.src = cloudimageURL;
      tempPreviewImage.src = previewCloudimageURL;
      tempPreviewImage.onload = () => { this.onImageLoad(); };
      tempOriginalImage.onload = () => { this.onImageLoad(true); }

      return previewCloudimageURL;
    } else {
      let tempOriginalImage = new Image();

      tempOriginalImage.src = cloudimageURL;
      tempOriginalImage.onload = () => { this.onImageLoad(true); }

      return cloudimageURL;
    }
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

  render() {
    if (isServer) return null;

    const { isLoaded, width, height, isProcessed } = this.state;
    const { alt, className, config, style, lazyLoadConfig, lazyLoading = config.lazyLoading, children, ...otherProps
    } = getFilteredProps(this.props);

    const { imgLoadingAnimation } = config;

    if (!isProcessed) return <div>{children}</div>;

    const containerProps = {
      imgLoadingAnimation, width, isLoaded, otherProps, style, className,
      children,
      backgroundURL: this.getBackgroundURL()
    };

    return lazyLoading ? (
      <LazyLoad height={height || 200} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
        <Container {...containerProps}/>
      </LazyLoad>
    ) : <Container {...containerProps}/>;
  }
}

const Container = props => {
  const { isLoaded, otherProps, style, imgLoadingAnimation, width, children, backgroundURL, className } = props;

  return (
    <div
      {...otherProps}
      className={
        `${className} cloudimage-image-background cloudimage-image-background-${isLoaded ? 'loaded' : 'loading'}`
      }
      style={styles.container({ style, url: backgroundURL })}
    >
      <div style={styles.containerInner({ imgLoadingAnimation, width, isLoaded })}/>
      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  container: ({ style, url }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    ...style
  }),

  containerInner: ({ imgLoadingAnimation, width, isLoaded }) => ({
    ...{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'inherit',
      filter: 'blur(0)',
      transition: 'filter 0.3s ease-in-out',
    },
    ...(imgLoadingAnimation ? { filter: `blur(${Math.floor(width / 100)}px)` } : {}),
    ...(isLoaded && imgLoadingAnimation ? styles.imgLoaded : {})
  }),

  imgLoading: {
    opacity: 1
  },

  imgLoaded: {
    opacity: 1,
    filter: 'blur(0px)'
  }
};

export default BackgroundImg;