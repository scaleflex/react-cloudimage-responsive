import {
  useState, useMemo, useEffect, useRef,
} from 'react';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import LazyLoad from 'react-lazyload';
import { getFilteredBgProps } from './utils';
import BackgroundInner from './background-inner';


function BackgroundImg(props) {
  const {
    config = {}, onImgLoad, src, children: defualtChildren,
  } = props;

  const [data, setData] = useState({});

  const bgNode = useRef();
  const server = useMemo(() => isServer(), []);

  const {
    height, cloudimgURL, previewCloudimgURL, preview, processed,
  } = data;

  const processBg = (update, windowScreenBecomesBigger) => {
    const bgData = processReactNode(
      props,
      bgNode.current,
      update,
      windowScreenBecomesBigger,
    );

    if (bgData) {
      setData(bgData);
    }
  };

  const {
    className,
    style,
    lazyLoadConfig,
    lazyLoading = config.lazyLoading,
    children,
    innerRef,
    doNotReplaceURL,
    ...otherProps
  } = getFilteredBgProps(props);

  useEffect(() => {
    if (server) return;

    processBg();
  }, []);


  const containerProps = {
    cloudimgURL,
    previewCloudimgURL,
    className,
    style,
    children,
    preview,
    config,
    onImgLoad,
    src,
    ...otherProps,
  };

  if (server) {
    return (
      <div>{defualtChildren}</div>
    );
  }

  if (!processed) {
    return (
      <div ref={bgNode}>{children}</div>
    );
  }

  return lazyLoading ? (
    <LazyLoad
      height={height}
      offset={config.lazyLoadOffset}
      {...lazyLoadConfig}
    >
      <BackgroundInner innerRef={innerRef} {...containerProps} />
    </LazyLoad>
  ) : (
    <BackgroundInner innerRef={innerRef} {...containerProps} />
  );
}


export default BackgroundImg;
