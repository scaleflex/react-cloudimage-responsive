import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import {
  checkIfRelativeUrlPath,
  checkOnMedia,
  generateSources,
  generateUrl,
  getAdaptiveSize,
  getImgSrc,
  getParentWidth,
  getSizeAccordingToPixelRatio
} from './utils';
import LazyLoad from 'react-lazyload';


class BackgroundImg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cloudimageUrl: '',
      sources: [],
      isLoaded: false,
      isProcessed: false
    }
  }

  componentDidMount() {
    this.processBackground();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.config.innerWidth !== this.props.config.innerWidth || this.props.src !== prevProps.src)
      this.processBackground();
  }

  getBreakPoint = (size) => [...size].reverse().find(item => window.matchMedia(item.media).matches);

  processBackground = () => {
    const backgroundNode = findDOMNode(this);
    const { src = '', config = {} } = this.props;
    const { lazyLoading = config.lazyLoading } = this.props;
    const { previewQualityFactor } = config;
    const operation = this.props.operation || this.props.o || config.operation;
    const parentContainerWidth = getParentWidth(backgroundNode, config);
    let size = this.props.size || this.props.s || config.size || parentContainerWidth;
    const filters = this.props.filters || this.props.f || config.filters;
    const isAdaptive = checkOnMedia(size);
    let backgroundImageSrc = '';

    size = isAdaptive ? getAdaptiveSize(size, config) : size;

    const isRelativeUrlPath = checkIfRelativeUrlPath(src);
    const imgSrc = getImgSrc(src, isRelativeUrlPath, config.baseUrl);
    const resultSize = isAdaptive ? size : getSizeAccordingToPixelRatio(size);
    const isPreview = (parentContainerWidth > 400) && lazyLoading;

    let cloudimageUrl = '';
    let sources = [];
    let previewCloudimageUrl, previewSources;

    if (isAdaptive) {
      sources = generateSources(operation, resultSize, filters, imgSrc, isAdaptive, config);
      const currentBreakpoint = this.getBreakPoint(resultSize) || resultSize[0];

      cloudimageUrl = sources.find(breakPoint => breakPoint.mediaQuery === currentBreakpoint.media).srcSet;
    } else {
      cloudimageUrl = generateUrl(operation, resultSize, filters, imgSrc, config);
    }

    if (isPreview) {
      const previewConfig = { ...config, queryString: '' };
      previewCloudimageUrl = isAdaptive ?
        generateUrl('width', Math.floor((parentContainerWidth / previewQualityFactor)), filters, imgSrc, previewConfig) :
        generateUrl(operation, resultSize.split('x')
          .map(size => Math.floor(size / previewQualityFactor)).join('x'), filters, imgSrc, previewConfig);
      previewSources = isAdaptive ?
        generateSources(operation, resultSize, filters, imgSrc, isAdaptive, previewConfig, true) : [];
    }

    this.setState({
      cloudimageUrl,
      previewCloudimageUrl,
      previewSources,
      sources,
      isAdaptive,
      size,
      parentContainerWidth,
      isProcessed: true,
      isPreview,
      backgroundImageSrc
    })
  }

  onImageLoad = (isPreviewLoaded) => {
    if (!this.state.isPreview) {
      this.setState({ isPreviewLoaded: true, isLoaded: true });
    } else if (isPreviewLoaded) {
      this.setState({ isLoaded: true });
    } else
      this.setState({ isPreviewLoaded: true });
  }

  getBackgroundURL = () => {
    const { isPreview, isLoaded, cloudimageUrl, isPreviewLoaded, previewCloudimageUrl } = this.state;

    if (isLoaded) return cloudimageUrl;
    if (isPreviewLoaded) return previewCloudimageUrl;

    if (isPreview) {
      let tempOriginalImage = new Image();
      let tempPreviewImage = new Image();

      tempOriginalImage.src = cloudimageUrl;
      tempPreviewImage.src = previewCloudimageUrl;
      tempPreviewImage.onload = () => { this.onImageLoad(); };
      tempOriginalImage.onload = () => { this.onImageLoad(true); }

      return previewCloudimageUrl;
    } else {
      let tempOriginalImage = new Image();

      tempOriginalImage.src = cloudimageUrl;
      tempOriginalImage.onload = () => { this.onImageLoad(true); }

      return cloudimageUrl;
    }
  }

  render() {
    const { isLoaded, parentContainerWidth, isProcessed } = this.state;
    const {
      src = '', alt = '', className = '', config = {}, ratio = null, o, operation, f, filters, s, size, style, height,
      lazyLoadConfig = {}, lazyLoading = this.props.config.lazyLoading, ...otherProps
    } = this.props;

    if (!isProcessed) return <div>{this.props.children}</div>;

    const imgLoadingStyles = config.imgLoadingAnimation ?
      { filter: `blur(${Math.floor(parentContainerWidth / 100)}px)` } : {};
    const imgLoadedStyles = isLoaded && config.imgLoadingAnimation ? styles.imgLoaded : {};
    const containerProps = {
      imgLoadingStyles, imgLoadedStyles, otherProps, isLoaded, style, className,
      children: this.props.children,
      getBackgroundURL: this.getBackgroundURL
    };

    return lazyLoading ? (
      <LazyLoad height={height || 200} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
        <Container {...containerProps}/>
      </LazyLoad>
    ) : <Container {...containerProps}/>;
  }
}

const Container = (props) => {
  const {
    isLoaded, otherProps, style, imgLoadingStyles, imgLoadedStyles, children, getBackgroundURL, className
  } = props;

  return (
    <div
      {...otherProps}
      className={
        `${className} cloudimage-image-background cloudimage-image-background-${isLoaded ? 'loaded' : 'loading'}`
      }
      style={{
        overflow: 'hidden',
        ...style,
        position: 'relative',
        backgroundImage: `url(${getBackgroundURL()})`
      }}
    >
      <div style={{...styles.containerInner, ...imgLoadingStyles, ...imgLoadedStyles}}/>
      {children}
    </div>
  );
};

const styles = {
  containerInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'inherit',
    filter: 'blur(0)',
    transition: 'filter 0.3s ease-in-out'
  },

  imgLoading: {
    opacity: 1
  },

  imgLoaded: {
    opacity: 1,
    filter: 'blur(0px)'
  }
};

export default BackgroundImg;