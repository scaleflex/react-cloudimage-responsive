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

    window.cloudimageBgIndex = (window.cloudimageBgIndex || 0) + 1;
    this.bgImageIndex = window.cloudimageBgIndex;
  }

  componentDidMount() {
    this.processBackground();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.config.innerWidth !== this.props.config.innerWidth || this.props.src !== prevProps.src)
      this.processBackground();
  }

  processBackground = () => {
    const backgroundNode = findDOMNode(this);
    const { src = '', config = {} } = this.props;
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
    //const isPreview = !config.isChrome && (parentContainerWidth > 400) && config.lazyLoading;
    const isPreview = (parentContainerWidth > 400) && config.lazyLoading;

    const cloudimageUrl = isAdaptive ?
      generateUrl('width', getSizeAccordingToPixelRatio(parentContainerWidth), filters, imgSrc, config) :
      generateUrl(operation, resultSize, filters, imgSrc, config);
    const sources = isAdaptive ?
      generateSources(operation, resultSize, filters, imgSrc, isAdaptive, config) : [];
    let previewCloudimageUrl, previewSources;

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
    } else if (isPreviewLoaded)
      this.setState({ isLoaded: true });
    else
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

  addBackgroundSources = (bgImageIndex, sources) => {
    let cssStyle = '';

    cssStyle += this.createCSSSource(null, sources[0].srcSet, bgImageIndex);

    [...sources.slice(1)].forEach(({ mediaQuery, srcSet }) => {
      cssStyle += this.createCSSSource(mediaQuery, srcSet, bgImageIndex);
    });

    return cssStyle;
  }

  createCSSSource = (mediaQuery, srcSet, bgImageIndex) => {
    if (mediaQuery) {
      return `@media all and ${mediaQuery} { [data-ci-bg-index="${bgImageIndex}"] { background-image: url('${srcSet}') !important; } }`
    } else {
      return `[data-ci-bg-index="${bgImageIndex}"] { background-image: url('${srcSet}') !important; }`;
    }
  }

  getSources = () => {
    const { sources } = this.state;

    if (sources.length === 0) return null;

    return <style>{this.addBackgroundSources(this.bgImageIndex, sources)}</style>;
  }

  render() {
    const { isLoaded, parentContainerWidth, isProcessed } = this.state;
    const {
      src = '', alt = '', className = '', config = {}, ratio = null, o, operation, f, filters, s, size, style, height,
      ...otherProps
    } = this.props;

    if (!isProcessed) return <div>{this.props.children}</div>;

    const imgLoadingStyles = config.imgLoadingAnimation ?
      { ...styles.imgWithEffect, filter: `blur(${Math.floor(parentContainerWidth / 100)}px)` } : {};
    const imgLoadedStyles = isLoaded && config.imgLoadingAnimation ? styles.imgLoaded : {};
    const containerProps = {
      imgLoadingStyles, imgLoadedStyles, otherProps, isLoaded, style, className,
      children: this.props.children,
      getBackgroundURL: this.getBackgroundURL,
      getSources: this.getSources,
      bgImageIndex: this.bgImageIndex
    };

    return config.lazyLoading ? (
      <LazyLoad height={height || 200} offset={config.lazyLoadOffset}>
        <Container {...containerProps}/>
      </LazyLoad>
    ) : <Container {...containerProps}/>;
  }
};

const Container = (props) => {
  const {
    isLoaded, otherProps, style, imgLoadingStyles, imgLoadedStyles, children, getBackgroundURL, getSources, className,
    bgImageIndex
  } = props;

  return (
    <div className="cloudimage-image-background-wrapper" style={{ overflow: 'hidden' }}>
      {getSources()}
      <div
        {...otherProps}
        className={
          `${className} cloudimage-image-background cloudimage-image-background-${isLoaded ? 'loaded' : 'loading'}`
        }
        style={{
          ...style,
          ...imgLoadingStyles,
          ...imgLoadedStyles,
          backgroundImage: `url(${getBackgroundURL()})`
        }}
        data-ci-bg-index={bgImageIndex}
      >{children}</div>
    </div>
  );
};

const styles = {
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

export default BackgroundImg;