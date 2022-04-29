import {
  useRef, useState, useEffect, useMemo,
} from 'react';
import { isServer, processReactNode, imgStyles as styles } from 'cloudimage-responsive-utils';
import LazyLoad from 'react-lazyload';
import { getFilteredProps } from './utils';
import usePrevious from './hooks/usePrevious';


function Img(props) {
  const {
    config, src, autoAlt, placeholderBackground,
  } = props;

  const [loaded, setLoaded] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [data, setData] = useState({});
  const [loadedImageDim, setLoadedImageDim] = useState({});

  const imgNode = useRef();
  const previousProps = usePrevious({ innerWidth: config.innerWidth, src });
  const server = useMemo(() => isServer(), []);

  const {
    lazyLoading: configLazyLoadingValue, lazyLoadOffset, delay, innerWidth,
  } = config;

  const { lazyLoading = configLazyLoadingValue } = props;

  const {
    ratio,
    operation,
    preview,
    previewCloudimgURL,
    cloudimgURL,
    cloudimgSRCSET,
    height,
  } = data;

  const {
    alt,
    className,
    lazyLoadConfig,
    preserveSize,
    imgNodeWidth,
    imgNodeHeight,
    ...otherProps
  } = getFilteredProps(props);

  const {
    innerRef, onImgLoad, disableAnimation, doNotReplaceURL, ...filteredProps
  } = otherProps;

  const getcloudimgSRCSET = () => cloudimgSRCSET
    .map(({ dpr, url }) => `${url} ${dpr}x`).join(', ');

  const processImg = (update, windowScreenBecomesBigger) => {
    const imageData = processReactNode(
      props,
      imgNode.current,
      update,
      windowScreenBecomesBigger,
    );

    if (imageData) {
      setData(imageData);
    }
  };

  const updateLoadedImageSize = (image) => {
    setLoadedImageDim({
      width: image.naturalWidth,
      height: image.naturalHeight,
      ratio: image.naturalWidth / image.naturalHeight,
    });
  };

  const _onImgLoad = (event) => {
    updateLoadedImageSize(event.target);
    setLoaded(true);

    if (typeof onImgLoad === 'function') {
      onImgLoad(event);
    }
  };

  const getAlt = (name) => {
    if (!name) return;

    const index = name.indexOf('.');
    return name.slice(0, index);
  };

  const onPreviewLoaded = (event) => {
    if (previewLoaded) return;

    const previewImage = event.target;

    updateLoadedImageSize(previewImage);
    setPreviewLoaded(true);
  };

  const pictureStyles = styles.picture({
    preserveSize,
    imgNodeWidth,
    imgNodeHeight,
    ratio: ratio || loadedImageDim.ratio,
    previewLoaded,
    loaded,
    placeholderBackground,
    operation,
  });

  const imageStyles = styles.image({
    preserveSize,
    imgNodeWidth,
    imgNodeHeight,
    operation,
  });

  const pictureClassName = `${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`
    .trim();

  useEffect(() => {
    if (disableAnimation) {
      innerRef.current = imgNode.current;
    }

    if (typeof delay !== 'undefined' && !server) {
      setTimeout(() => {
        processImg();
      }, delay);
    } else {
      processImg();
    }
  }, []);

  useEffect(() => {
    if (!previousProps) return;

    if (previousProps.innerWidth !== innerWidth) {
      processImg(
        true,
        innerWidth > previousProps.innerWidth,
      );
    }

    if (src !== previousProps.src) {
      processImg();
    }
  }, [innerWidth, src]);

  const pictureAlt = !alt && autoAlt ? getAlt(src) : alt;

  const plainImage = (
    <img
      {...filteredProps}
      ref={imgNode}
      className={pictureClassName}
      style={imageStyles}
      alt={pictureAlt}
      {...(!server && {
        src: cloudimgURL,
        onLoad: _onImgLoad,
      })}
      {...(cloudimgSRCSET && !server && {
        srcSet: getcloudimgSRCSET(),
      })}
    />
  );

  const picture = (
    <div
      className={pictureClassName}
      style={pictureStyles}
      ref={imgNode}
    >
      {preview && operation !== 'bound' && (
        <div style={styles.previewWrapper()}>
          <img
            style={styles.previewImg({ loaded, operation })}
            src={previewCloudimgURL}
            alt="low quality preview"
            onLoad={onPreviewLoaded}
          />
        </div>
      )}
      <img
        {...filteredProps}
        ref={innerRef}
        alt={pictureAlt}
        style={styles.img({ preview, loaded, operation })}
        {...(!server && {
          src: cloudimgURL,
          onLoad: _onImgLoad,
        })}
        {...(cloudimgSRCSET && !server && {
          srcSet: getcloudimgSRCSET(),
        })}
      />
    </div>
  );

  const renderedPicture = disableAnimation ? plainImage : picture;

  return lazyLoading && !server ? (
    <div ref={imgNode}>
      <LazyLoad
        height={height}
        offset={lazyLoadOffset}
        {...lazyLoadConfig}
      >
        {renderedPicture}
      </LazyLoad>
    </div>
  ) : renderedPicture;
}

export default Img;
