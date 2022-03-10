import { useState, useEffect } from 'react';
import { backgroundStyles as styles } from 'cloudimage-responsive-utils';


function BackgroundInner(props) {
  const {
    config = {},
    cloudimgURL,
    previewCloudimgURL,
    className,
    style,
    children,
    preview,
    src,
    onImgLoad,
    innerRef,
    ...otherProps
  } = props;

  const [loaded, setLoaded] = useState(false);

  const { alt } = otherProps;

  const { autoAlt, delay } = config;

  const _onImgLoad = (event) => {
    setLoaded(true);

    if (typeof onImgLoad === 'function') {
      onImgLoad(event);
    }
  };

  const preLoadImg = () => {
    const img = new Image();

    img.onload = _onImgLoad;
    img.src = cloudimgURL;
  };

  const getAlt = (name) => {
    if (!name) return;

    const index = name.indexOf('.');

    return name.slice(0, index);
  };

  const containerClassName = [
    className,
    'cloudimage-background',
    loaded ? 'loaded' : 'loading',
  ].join(' ').trim();

  useEffect(() => {
    if (typeof delay !== 'undefined') {
      setTimeout(() => {
        preLoadImg();
      }, delay);
    } else {
      preLoadImg();
    }
  }, []);

  return (
    <div
      {...otherProps}
      alt={(!alt && autoAlt) ? getAlt(src) : alt}
      className={containerClassName}
      ref={innerRef}
      style={styles.container({ style, cloudimgURL })}
    >
      {preview && (
        <div style={styles.previewBgWrapper({ loaded })}>
          <div style={styles.previewBg({ previewCloudimgURL })} />
        </div>
      )}

      {preview ? (
        <div className="cloudimage-background-content" style={{ position: 'relative' }}>
          {children}
        </div>
      ) : children}
    </div>
  );
}

export default BackgroundInner;
