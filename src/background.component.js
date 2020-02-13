import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { getFilteredBgProps, server, processNode } from './utils';
import LazyLoad from 'react-lazyload';
import styles from './background.styles';


class BackgroundImg extends Component {
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

    this.processBg();
  }

  componentDidUpdate(prevProps) {
    if (server) return;

    const { config: { innerWidth }, src } = this.props;

    if (prevProps.config.innerWidth !== innerWidth) {
      this.processBg(true, innerWidth > prevProps.config.innerWidth);
    }

    if (src !== prevProps.src) {
      this.processBg();
    }
  }

  processBg = (update, windowScreenBecomesBigger) => {
    const bgNode = findDOMNode(this);
    const data = processNode(this.props, bgNode, update, windowScreenBecomesBigger);

    if (!data) {
      return;
    }

    if (this.state.cloudimgURL !== data.cloudimgURL) {
      this.preLoadImg(data.cloudimgURL);
    }

    this.setState(data);
  }

  preLoadImg = (cloudimgURL) => {
    const img = new Image();

    img.onload = this.onImgLoad;
    img.src = cloudimgURL;
  }

  onImgLoad = () => {
    this.setState({ loaded: true });
  }

  render() {
    if (server) return null;
    
    const { loaded, width, height, processed, cloudimgURL, previewCloudimgURL, preview } = this.state;
    const {
      alt, className, config, style, lazyLoadConfig, lazyLoading = config.lazyLoading, children, ...otherProps
    } = getFilteredBgProps(this.props);

    if (!processed) return <div>{children}</div>;

    const Container = (
      <div
        {...otherProps}
        className={[
          className,
          'cloudimage-image-background',
          `cloudimage-image-background-${loaded ? 'loaded' : 'loading'}`
        ].join(' ')}
        style={styles.container({ style, cloudimgURL })}
      >
        {preview &&
        <div style={styles.previewBgWrapper({ loaded })}>
          <div style={styles.previewBg({ previewCloudimgURL, width })}/>
        </div>}

        {preview ?
          <div className="cloudimage-image-background-content" style={{ position: 'relative' }}>
            {children}
          </div>
          : children}
      </div>
    );

    return lazyLoading ? (
      <LazyLoad height={height || 200} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
        {Container}
      </LazyLoad>
    ) : Container;
  }
}

export default BackgroundImg;