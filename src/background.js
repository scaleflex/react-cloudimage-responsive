import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredBgProps } from './utils.js';
import LazyLoad from 'react-lazyload';
import { backgroundStyles as styles } from 'cloudimage-responsive-utils';

class BackgroundImg extends Component {
  constructor(props) {
    super(props);

    this.server = isServer();
    this.state = { cloudimgURL: '', processed: false };
  }

  componentDidMount() {
    if (this.server) return;

    this.processBg();
  }

  componentDidUpdate(prevProps) {
    if (this.server) return;

    const {
      config: { innerWidth },
      src
    } = this.props;

    if (prevProps.config.innerWidth !== innerWidth) {
      this.processBg(true, innerWidth > prevProps.config.innerWidth);
    }

    if (src !== prevProps.src) {
      this.processBg();
    }
  }

  processBg = (update, windowScreenBecomesBigger) => {
    const bgNode = findDOMNode(this);
    const data = processReactNode(
      this.props,
      bgNode,
      update,
      windowScreenBecomesBigger
    );

    if (!data) {
      return;
    }

    this.setState(data);
  };

  render() {
    if (this.server) return <div>{this.props.children}</div>;

    const { height, processed, cloudimgURL, previewCloudimgURL, preview } = this.state;
    const { config = {}, onImgLoad, src } = this.props;
    const {
      className,
      style,
      lazyLoadConfig,
      lazyLoading = config.lazyLoading,
      children,
      ...otherProps
    } = getFilteredBgProps(this.props);

    if (!processed) return <div>{children}</div>;

    const Container = (
      <BackgroundInner
        {...{
          cloudimgURL,
          previewCloudimgURL,
          className,
          style,
          children,
          preview,
          otherProps,
          config,
          onImgLoad,
          src
        }}
      />
    );

    return lazyLoading ? (
      <LazyLoad
        height={height}
        offset={config.lazyLoadOffset}
        {...lazyLoadConfig}
      >
        {Container}
      </LazyLoad>
    ) : (
      Container
    );
  }
}

class BackgroundInner extends Component {
  state = { loaded: false };

  componentDidMount() {
    const {
      config: { delay }
    } = this.props;

    if (typeof delay !== 'undefined') {
      setTimeout(() => {
        this.preLoadImg(this.props.cloudimgURL);
      }, delay);
    } else {
      this.preLoadImg(this.props.cloudimgURL);
    }
  }

  preLoadImg = cloudimgURL => {
    const img = new Image();

    img.onload = this._onImgLoad;
    img.src = cloudimgURL;
  };

  _onImgLoad = (...params) => {
    this.setState({ loaded: true });
  
    const { onImgLoad } = this.props;
    if(typeof onImgLoad === "function"){
      onImgLoad(params);
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
    const { loaded } = this.state;
    const {
      config: { autoAlt },
      cloudimgURL,
      previewCloudimgURL,
      className,
      style,
      children,
      preview,  
      src,
      otherProps
    } = this.props;
    
    const {onImgLoad, alt, ...filteredProps} = otherProps
    return (
      <div
        {...filteredProps}
        alt={!alt && autoAlt? this.getAlt(src) : alt }
        className={[
          className,
          'cloudimage-background',
          loaded ? 'loaded' : 'loading'
        ]
          .join(' ')
          .trim()}
        style={styles.container({ style, cloudimgURL })}
      >
        {preview && (
          <div style={styles.previewBgWrapper({ loaded })}>
            <div style={styles.previewBg({ previewCloudimgURL })} />
          </div>
        )}

        {preview ? (
          <div
            className="cloudimage-background-content"
            style={{ position: 'relative' }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
}

export default BackgroundImg;
