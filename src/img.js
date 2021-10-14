import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils.js';
import { imgStyles as styles } from 'cloudimage-responsive-utils';
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

  UNSAFE_componentWillMount() {
    if (this.server) {
      this.processImg();
    }
  }

  componentDidMount() {
    const {
      config: { delay } = {}
    } = this.props;

    if (typeof delay !== 'undefined' && !this.server) {
      setTimeout(() => {
        this.processImg();
      }, delay);
    } else {
      this.processImg();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.server) return;

    const {
      config: { innerWidth } = {},
      src
    } = this.props;

    if ((prevProps.config && prevProps.config.innerWidth) !== innerWidth) {
      this.processImg(true, innerWidth > (prevProps.config && prevProps.config.innerWidth));
    }

    if (src !== prevProps.src) {
      this.processImg();
    }
  }

  processImg = (update, windowScreenBecomesBigger) => {
    const imgNode = !this.server ? findDOMNode(this) : null;
    const data = processReactNode(
      this.props,
      imgNode,
      update,
      windowScreenBecomesBigger
    );

    this.setState(data);
  };

  onPreviewLoaded = event => {
    if (this.state.previewLoaded) return;

    this.updateLoadedImageSize(event.target);
    this.setState({ previewLoaded: true });
  };

  updateLoadedImageSize = image => {
    this.setState({
      loadedImageWidth: image.naturalWidth,
      loadedImageHeight: image.naturalHeight,
      loadedImageRatio: image.naturalWidth / image.naturalHeight
    });
  };

  _onImgLoad = (event) => {
    this.updateLoadedImageSize(event.target);
    this.setState({ loaded: true });
    
    const { onImgLoad } = this.props;
    if(typeof onImgLoad === "function"){
      onImgLoad(event);
    }
  }

  getAlt = (name) => {
   if(!name){
     return
   }
   const index = name.indexOf('.')
   return name.slice(0, index)
  }
  
  render() {
    const { config = {} } = this.props;
    const {
      placeholderBackground,
      lazyLoading: configLazyLoadingValue,
      autoAlt
    } = config;
    const { lazyLoading = configLazyLoadingValue } = this.props;
    const {
      height,
      ratio,
      cloudimgURL,
      cloudimgSRCSET,
      previewCloudimgURL,
      loaded,
      previewLoaded,
      preview,
      loadedImageRatio,
      operation
    } = this.state;

    const {
      alt,
      className,
      lazyLoadConfig,
      preserveSize,
      imgNodeWidth,
      imgNodeHeight,
      ...otherProps
    } = getFilteredProps(this.props);

    const {onImgLoad,...filteredProps} = otherProps
    const picture = (
      <div
        className={`${className} cloudimage-image ${
          loaded ? 'loaded' : 'loading'
        }`.trim()}
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
        {preview && operation !== 'bound' && (
          <div style={styles.previewWrapper()}>
            <img
              style={styles.previewImg({ loaded, operation })}
              src={previewCloudimgURL}
              alt="low quality preview image"
              onLoad={this.onPreviewLoaded}
            />
          </div>
        )}

        <img
          alt={!alt && autoAlt? this.getAlt(this.props.src) : alt }
          style={styles.img({ preview, loaded, operation })}
          {...filteredProps}
          {...(!this.server && {
            src: cloudimgURL,
            onLoad: this._onImgLoad
          })}
          {...(cloudimgSRCSET && !this.server && { srcSet: cloudimgSRCSET.map(({ dpr, url }) => `${url} ${dpr}x`).join(', ') })}
        />
      </div>
    );

    return lazyLoading && !this.server ? (
      <LazyLoad
        height={height}
        offset={config.lazyLoadOffset}
        {...lazyLoadConfig}
      >
        {picture}
      </LazyLoad>
    ) : (
      picture
    );
  }
}

export default Img;
