import React, { Fragment, Component } from 'react';
import { findDOMNode } from 'react-dom';
import {
  checkIfRelativeUrlPath, checkOnMedia, generateSources, generateUrl, getAdaptiveSize, getImgSrc, getParentWidth,
  getRatioBySize, getSizeAccordingToPixelRatio
} from './utils';
import LazyLoad from 'react-lazyload';


class Img extends Component {
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
    this.processImage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.config.innerWidth !== this.props.config.innerWidth || this.props.src !== prevProps.src)
      this.processImage();
  }

  processImage = () => {
    const imgNode = findDOMNode(this);
    const { src = '', config = {} } = this.props;
    const { previewQualityFactor } = config;
    const { lazyLoading = config.lazyLoading } = this.props;
    const operation = this.props.operation || this.props.o || config.operation;
    const parentContainerWidth = getParentWidth(imgNode, config);
    let size = this.props.size || this.props.s || config.size || parentContainerWidth;
    const filters = this.props.filters || this.props.f || config.filters;
    const isAdaptive = checkOnMedia(size);

    size = isAdaptive ? getAdaptiveSize(size, config) : size;

    const isRelativeUrlPath = checkIfRelativeUrlPath(src);
    const imgSrc = getImgSrc(src, isRelativeUrlPath, config.baseUrl);
    const resultSize = isAdaptive ? size : getSizeAccordingToPixelRatio(size);
    //const isPreview = !config.isChrome && (parentContainerWidth > 400) && lazyLoading;
    const isPreview = (parentContainerWidth > 400) && lazyLoading;

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
      isPreview
    })
  }

  onImageLoad = (isPreviewLoaded) => {
    if (!this.state.isPreview) {
      this.setState({ isPreviewLoaded: true, isLoaded: true });
    }
    else if (isPreviewLoaded)
      this.setState({ isLoaded: true });
    else
      this.setState({ isPreviewLoaded: true });
  }

  render() {
    const {
      cloudimageUrl, sources, isLoaded, parentContainerWidth, isProcessed, isPreviewLoaded, previewCloudimageUrl,
      previewSources, isPreview
    } = this.state;
    const {
      src = '', alt = '', className = '', config = {}, ratio = null, o, operation, f, filters, s, size,
      lazyLoading = this.props.config.lazyLoading, lazyLoadConfig, ...otherProps
    } = this.props;

    if (!isProcessed) return <picture/>;

    const ratioBySize = getRatioBySize(this.state.size, config);
    const imageHeight = Math.floor(parentContainerWidth / (ratioBySize || ratio || 1));
    const resultRatio = (ratioBySize || ratio);

    const pictureWithRatioStyles =  resultRatio ?
      {
        paddingBottom: (100 / resultRatio) + '%',
        background: (!isPreviewLoaded && !isLoaded) ? config.placeholderBackground : 'transparent'
      } : {};
    const imgWithRatioStyles = resultRatio ? styles.imgWithRatio : {};
    const imgLoadingStyles = config.imgLoadingAnimation ?
      { ...styles.imgWithEffect, filter: `blur(${Math.floor(parentContainerWidth / 100)}px)` } : {};
    const imgLoadedStyles = isLoaded && config.imgLoadingAnimation ? styles.imgLoaded : {};

    const picture = (
      <picture
        className={`${className} cloudimage-image-picture cloudimage-image-${isLoaded ? 'loaded' : 'loading'}`}
        style={{
          ...styles.picture,
          ...pictureWithRatioStyles
        }}
      >
        {this.getSources(sources, isPreview, isPreviewLoaded, previewSources)}

        <img
          style={{
            ...styles.img,
            ...imgWithRatioStyles,
            ...imgLoadingStyles,
            ...imgLoadedStyles,
            ...((isPreview && resultRatio) ? { height: '100%' } : {})
          }}
          src={!isPreview ? cloudimageUrl : (isPreviewLoaded ? cloudimageUrl : previewCloudimageUrl)}
          alt={alt}
          onLoad={() => { this.onImageLoad(isPreviewLoaded); }}
          {...otherProps}
        />
      </picture>
    );


    return lazyLoading ? (
      <LazyLoad height={imageHeight} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
        {picture}
      </LazyLoad>
    ) : picture;
  }

  getSources = (sources, isPreview, isPreviewLoaded, previewSources) => {
    const resultSources = [...(!isPreview ? sources : (isPreviewLoaded ? sources : previewSources))];
    const firstSource = resultSources[0];

    return (
      <Fragment>
        {(
          resultSources
            .slice(1)
            .reverse()
            .map((source) => (
              <source
                key={source.srcSet}
                media={(source.mediaQuery || '')}
                srcSet={source.srcSet || ''}
                onLoad={() => { this.onImageLoad(isPreviewLoaded); }}
              />
            ))
        )}
        {firstSource &&
        <source
          key={firstSource.srcSet}
          srcSet={firstSource.srcSet || ''}
          onLoad={() => { this.onImageLoad(isPreviewLoaded); }}
        />}
      </Fragment>
    );
  }
}

const styles = {
  picture: {
    display: 'block',
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
  },

  pictureWithRatio: {},

  img: {
    display: 'block',
    width: '100%',
  },

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