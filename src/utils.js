export const processNode = (props, imgNode, isUpdate, windowScreenBecomesBigger) => {
  const imgProps = getProps(props);
  const { imgNodeSRC, params, sizes, adaptive } = imgProps;
  const { config } = props;
  const { baseURL, presets } = config;

  if (!imgNodeSRC) return;

  const [src, svg] = getImgSRC(imgNodeSRC, baseURL);
  let previewCloudimgURL, size;

  if (adaptive) {
    size = getBreakPoint(sizes, presets);
  } else {
    if (isUpdate && !windowScreenBecomesBigger) return;
  }

  const containerProps = determineContainerProps({ imgNode, config, size, ...imgProps });
  const { width, height } = containerProps;
  const preview = isLowQualityPreview(adaptive, width, svg);
  const cloudimgURL = !adaptive && svg ? src : generateURL({ src, params, config, width, height });

  if (preview) {
    previewCloudimgURL = getPreviewSRC({ src, params, config, ...containerProps });
  }

  return {
    cloudimgURL,
    previewCloudimgURL,
    processed: true,
    preview,
    ...containerProps
  };
};

export const getImgSRC = (src, baseURL = '') => {
  const relativeURLPath = isRelativeUrlPath(src);

  if (src.indexOf('//') === 0) {
    src = window.location.protocol + src;
  }

  if (relativeURLPath) {
    src = relativeToAbsolutePath(baseURL, src);
  }

  return [src, isSVG(src)];
};

export const getBreakPoint = (sizes, presets) => {
  const size = getAdaptiveSize(sizes, presets);

  return [...size].reverse().find(item => window.matchMedia(item.media).matches);
};

const getAdaptiveSize = (sizes, presets) => {
  const resultSizes = [];

  Object.keys(sizes).forEach(key => {
    const customMedia = key.indexOf(':') > -1;
    const media = customMedia ? key : presets[key];

    resultSizes.push({ media, params: normalizeSize(sizes[key]) });
  });

  return resultSizes;
};

export const isLowQualityPreview = (adaptive, width, svg) => adaptive ? width > 400 : width > 400 && !svg;

export const getPreviewSRC = ({ config, width, height, params, src }) => {
  const { previewQualityFactor } = config;
  const previewParams = { ...params, ci_info: '' };
  const lowQualitySize = getLowQualitySize({ width, height }, previewQualityFactor);

  return generateURL({ src, config, params: { ...previewParams, ...lowQualitySize } });
};

const getLowQualitySize = (params = {}, factor) => {
  let { width, height } = params;

  width = width ? Math.floor(width / factor) : null;
  height = height ? Math.floor(height / factor) : null;

  return { width, w: width, height, h: height };
};

export const server = typeof window === 'undefined';

export const isRelativeUrlPath = src => {
  if (!src) return false;

  if (src.indexOf('//') === 0) {
    src = window.location.protocol + src;
  }

  return src.indexOf('http://') !== 0 && src.indexOf('https://') !== 0 && src.indexOf('//') !== 0;
};

const relativeToAbsolutePath = (base, relative) => {
  const root = relative[0] === '/';
  const resultBaseURL = getBaseURL(root, base);
  const stack = resultBaseURL.split('/');
  const parts = relative.split('/');

  stack.pop(); // remove current file name (or empty string)
               // (omit if 'base' is the current folder without trailing slash)
  if (root) {
    parts.shift();
  }

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '.')
      continue;
    if (parts[i] === '..')
      stack.pop();
    else
      stack.push(parts[i]);
  }

  return stack.join('/');
};

const getBaseURL = (root, base) => {
  if (root) {
    return (base ? extractBaseURLFromString(base) : window.location.origin) + '/';
  } else {
    return base ? base : document.baseURI;
  }
};

export const isSVG = url => url.slice(-4).toLowerCase() === '.svg';

const extractBaseURLFromString = (path = '') => {
  const pathArray = path.split('/');
  const protocol = pathArray[0];
  const host = pathArray[2];

  return protocol + '//' + host;
};

export const generateURL = props => {
  const { src, params, config, width, height } = props;
  const { token, domain, doNotReplaceURL } = config;
  const configParams = getParams(config.params);

  return [
    doNotReplaceURL ? '' : `https://${token}.${domain}/v7/`,
    src,
    src.includes('?') ? '&' : '?',
    getQueryString({ params: { ...configParams, ...params }, width, height })
  ].join('');
};

const getParamsExceptSizeRelated = params => {
  const { w, h, width, height, ...restParams } = params;

  return [restParams, w || width, h || height];
};

const getQueryString = props => {
  const { params = {}, width, height } = props;
  const [restParams, widthFromParam = null, heightFromParam] = getParamsExceptSizeRelated(params);
  const widthQ = width ? updateSizeWithPixelRatio(width) : widthFromParam;
  const heightQ = height ? updateSizeWithPixelRatio(height) : heightFromParam;
  const restParamsQ = Object
    .keys(restParams)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(restParams[key]))
    .join('&');

  return [
    widthQ ? `w=${widthQ}` : '',
    heightQ ? ((widthQ ? '&' : '') + `h=${heightQ}`) : '',
    restParamsQ ? '&' + restParamsQ : ''
  ].join('');
};

/*
* possible size values: 200 | 200x400
* */
export const updateSizeWithPixelRatio = (size) => {
  const splittedSizes = size.toString().split('x');
  const result = [];

  [].forEach.call(splittedSizes, size => {
    size ? result.push(Math.floor(size * (window.devicePixelRatio.toFixed(1) || 1))) : '';
  });

  return result.join('x');
};

/**
 * Get container width for an image.
 *
 * Priority:
 * 1. inline styling
 * 2. parent node computed style width (up to body tag)
 *
 * @param {HTMLImageElement} img - image node
 * @return {Number} width of image container
 */
export const getImgContainerWidth = (img) => {
  const imgStyleWidth = img && img.style && img.style.width;
  const imgWidth = imgStyleWidth && convertToPX(imgStyleWidth);

  if (imgWidth) return parseInt(imgWidth, 10);

  return parseInt(getParentContainerSize(img), 10);
}

export const convertToPX = (size = '') => {
  size = size.toString();

  if (size.indexOf('px') > -1) {
    return parseInt(size);
  } else if (size.indexOf('%') > -1) {
    // todo calculate container width * %
  } else if (size.indexOf('vw') > -1) {
    return window.innerWidth * parseInt(size) / 100;
  } else if (size.indexOf('vh') > -1) {
    return window.innerHeight * parseInt(size) / 100;
  }

  return parseInt(size) || null;
};

/**
 * Get container height for an image.
 *
 * Priority:
 * 1. inline styling
 * 2. parent node computed style width (up to body tag)
 *
 * @param {HTMLImageElement} img - image node
 * @return {Number} width of image container
 */
export const getImgContainerHeight = (img) => {
  const imgStyleHeight = img && img.style && img.style.height;
  const imgHeight = convertToPX(imgStyleHeight);

  if (imgHeight) return parseInt(imgHeight, 10);

  return parseInt(getParentContainerSize(img, 'height'), 10);
}

const getParentContainerSize = (img, type = 'width') => {
  let parentNode = null;
  let size = 0;

  do {
    parentNode = (parentNode && parentNode.parentNode) || img.parentNode;
    size = parentNode.getBoundingClientRect()[type];
  } while (parentNode && !size)

  const leftPadding = size && parentNode && parseInt(window.getComputedStyle(parentNode).paddingLeft);
  const rightPadding = parseInt(window.getComputedStyle(parentNode).paddingRight)

  return size + (size ? (-leftPadding - rightPadding) : 0);
}

const normalizeSize = (params = {}) => {
  let { w, h } = params;

  if ((w.toString()).indexOf('vw') > -1) {
    const percent = parseFloat(w);

    w = window.innerWidth * percent / 100;
  } else {
    w = parseFloat(w);
  }

  if ((h.toString()).indexOf('vh') > -1) {
    const percent = parseFloat(h);

    h = window.innerHeight * percent / 100;
  } else {
    h = parseFloat(h);
  }

  return { w, h };
};

/**
 * Get size limit for container/image.
 *
 * Priority:
 * 1. inline styling
 * 2. parent node computed style size (up to body tag)
 *
 * @param {Number} size - width/height of container/image
 * @param {Boolean} exactSize - a flag to use exact width/height params
 * @return {Number} size limit
 */
export const getSizeLimit = (size, exactSize) => {
  if (exactSize) return Math.ceil(size);
  if (size <= 25) return 25;
  if (size <= 50) return 50;

  return Math.ceil(size / 100) * 100;
};

export const getParams = (params) => {
  let resultParams = undefined;

  try {
    resultParams = JSON.parse('{"' + decodeURI(params.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
  } catch (e) {}

  if (!resultParams) {
    resultParams = params;
  }

  return resultParams;
};

export const getRatio = ({ imgNodeRatio, width, height, size }) => {
  if (size && size.params) {
    if (size.params.ratio) {
      return size.params.ratio
    } else if ((size.params.w || size.params.width) && (size.params.h || size.params.height)) {
      return (size.params.w || size.params.width) / (size.params.h || size.params.height);
    } else {
      return null
    }
  }

  if (imgNodeRatio) {
    return imgNodeRatio;
  } else if (width && height) {
    return width / height;
  }

  return null;
}

/**
 * Get width for an image.
 *
 * Priority:
 * 1. image node param width
 * 2. image node image width
 * 3. image node inline styling
 * 4. parent node of image computed style width (up to body tag)
 *
 * @param {HTMLImageElement} props.imgNode - image node
 * @param {Boolean} props.exactSize - a flag to use exact width/height params
 * @param {Number} props.imgNodeWidth - width of image node
 * @param {String} props.params - params of image node
 * @return {Number} width limit
 */
export const getWidth = props => {
  const { imgNode = null, exactSize = false, imgNodeWidth = null, params = {}, size } = props;
  const crop = params.func === 'crop';

  if (size && size.params) {
    return size.params.w || size.params.width;
  }

  if (params.width || params.w) {
    return params.width || params.w;
  }

  if (imgNodeWidth) {
    return convertToPX(imgNodeWidth);
  }

  const ImgContainerWidth = getImgContainerWidth(imgNode);

  return crop ? ImgContainerWidth : getSizeLimit(ImgContainerWidth, exactSize);
}

/**
 * Get height for an image.
 *
 * Priority:
 * 1. image node param height
 * 2. image node image height
 * 3. image node inline styling
 * 4. parent node of image computed style height (up to body tag)
 *
 * @param {HTMLImageElement} props.imgNode - image node
 * @param {Object} props.config - plugin config
 * @param {Boolean} props.exactSize - a flag to use exact width/height params
 * @param {Number} props.imgNodeHeight - height of image node
 * @param {String} props.params - params of image node
 * @return {Number} height limit
 */
export const getHeight = props => {
  const { imgNode = null, config = {}, exactSize = false, imgNodeHeight = null, params = {}, size } = props;
  const crop = params.func === 'crop';

  if (size && size.params) {
    return size.params.h || size.params.height;
  }

  if (params.height || params.h) {
    return params.height || params.h;
  }

  if (imgNodeHeight) {
    return convertToPX(imgNodeHeight);
  }

  if ((params.func || config.params.func) !== 'crop') {
    return null;
  }

  const imgContainerHeight = getImgContainerHeight(imgNode);

  return crop ? imgContainerHeight : getSizeLimit(imgContainerHeight, exactSize);
};

export const determineContainerProps = props => {
  const { imgNode, config, imgNodeWidth, imgNodeHeight, imgNodeRatio, params, size } = props;
  const { exactSize } = config;
  let width = getWidth({ imgNode, exactSize, imgNodeWidth, params, size });
  let height = getHeight({ imgNode, config, exactSize, imgNodeHeight, params, size });
  let ratio = getRatio({ imgNodeRatio, width, height, size });

  if (!height && width && ratio) {
    height = Math.floor(width / ratio);
  }

  if (!width && height && ratio) {
    width = Math.floor(height * ratio);
  }

  return { width, height, ratio };
};

export const getProps = ({ src, width, height, ratio, params, sizes }) => ({
  imgNodeSRC: src || '',
  imgNodeWidth: width || null,
  imgNodeHeight: height || null,
  imgNodeRatio: ratio,
  params: getParams(params),
  sizes: sizes,
  adaptive: !!sizes
});

export const getFilteredProps = ({ config = {}, alt = '', className = '', src, sizes, width, height, ...otherProps }) => ({
  config,
  alt,
  className,
  imgNodeWidth: width,
  imgNodeHeight: height,
  ...otherProps
});

export const getFilteredBgProps = ({ config = {}, alt = '', className = '', src, sizes, width, height, ...otherProps }) => ({
  config,
  alt,
  className,
  ...otherProps
});