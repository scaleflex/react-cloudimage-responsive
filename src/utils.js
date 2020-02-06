export const isServer = typeof window === 'undefined';

export const checkIfRelativeUrlPath = src => {
  if (!src) return false;

  if (src.indexOf('//') === 0) {
    src = window.location.protocol + src;
  }

  return (src.indexOf('http://') !== 0 && src.indexOf('https://') !== 0 && src.indexOf('//') !== 0);
}

export const getImgSrc = (src, isRelativeUrlPath = false, baseURL = '') => {
  if (src.indexOf('//') === 0) {
    src = window.location.protocol + src;
  }

  if (isRelativeUrlPath) {
    return relativeToAbsolutePath(baseURL, src);
  }

  return src;
};

const relativeToAbsolutePath = (base, relative) => {
  const isRoot = relative[0] === '/';
  const resultBaseURL = getBaseURL(isRoot, base);
  const stack = resultBaseURL.split("/");
  const parts = relative.split("/");

  stack.pop(); // remove current file name (or empty string)
               // (omit if "base" is the current folder without trailing slash)
  if (isRoot) {
    parts.shift();
  }

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === ".")
      continue;
    if (parts[i] === "..")
      stack.pop();
    else
      stack.push(parts[i]);
  }

  return stack.join("/");
};

const getBaseURL = (isRoot, base) => {
  if (isRoot) {
    return (base ? extractBaseURLFromString(base) : window.location.origin) + '/';
  } else {
    return base ? base : document.baseURI;
  }
};

export const isImageSVG = url => url.slice(-4).toLowerCase() === '.svg';

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
  const {
    params = {},
    width,
    height
  } = props;
  const [restParams, widthFromParam = null, heightFromParam] = getParamsExceptSizeRelated(params);
  const widthQ = width ? updateSizeWithPixelRatio(width) : widthFromParam;
  const heightQ = height ? updateSizeWithPixelRatio(height) : heightFromParam;
  const restParamsQ = Object
    .keys(restParams)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(restParams[key]))
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
 * @param {Object} config - config of the plugin
 * @return {Number} width of image container
 */
export const getImageContainerWidth = (img, config) => {
  let imageWidth = null;
  const imageStyleWidth = img && img.style && img.style.width;

  if (imageStyleWidth.indexOf('px') > -1) {
    imageWidth = parseInt(imageStyleWidth).toString();
  } else if (imageStyleWidth.indexOf('%') > -1) {
    // todo calculate container width * %
  }

  if (imageWidth) return parseInt(imageWidth, 10);

  /*
  * If no parentElement
  * */
  if (!(img && img.parentElement && img.parentElement.getBoundingClientRect)) {
    return config.width;
  }

  return parseInt(getParentContainerSize(img), 10);
}

/**
 * Get container height for an image.
 *
 * Priority:
 * 1. inline styling
 * 2. parent node computed style width (up to body tag)
 *
 * @param {HTMLImageElement} img - image node
 * @param {Object} config - config of the plugin
 * @return {Number} width of image container
 */
export const getImageContainerHeight = (img, config) => {
  let imageHeight = null;
  const imageStyleHeight = img && img.style && img.style.height;

  if (imageStyleHeight.indexOf('px') > -1) {
    imageHeight = parseInt(imageStyleHeight, 10).toString();
  } else if (imageStyleHeight.indexOf('%') > -1) {
    // todo calculate container height * %
  }

  if (imageHeight) return parseInt(imageHeight, 10);

  /*
  * If no parentElement
  * */
  if (!(img && img.parentElement && img.parentElement.getBoundingClientRect)) {
    console.info('You have problem with the following image: ', img, 'Pls, contact cloudimage support with your example.')
    return config.heightFallback;
  }

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

export const getBreakPoint = (size) => [...size].reverse().find(item => window.matchMedia(item.media).matches);

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
  if (exactSize) return size;
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

export const getRatio = ({ imageNodeRatio, width, height, size }) => {
  if (size && size.params) {
    if (size.params.ratio) {
      return size.params.ratio
    } else if ((size.params.w || size.params.width) && (size.params.h || size.params.height)) {
      return (size.params.w || size.params.width) / (size.params.h || size.params.height);
    } else {
      return null
    }
  }

  if (imageNodeRatio) {
    return imageNodeRatio;
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
 * @param {Object} props.config - plugin config
 * @param {Boolean} props.exactSize - a flag to use exact width/height params
 * @param {Number} props.imageNodeWidth - width of image node
 * @param {String} props.params - params of image node
 * @return {Number} width limit
 */
export const getWidth = props => {
  const {
    imgNode = null,
    config = {},
    exactSize = false,
    imageNodeWidth = null,
    params = {},
    size
  } = props;
  const isCrop = params.func === 'crop';

  if (size && size.params) {
    return size.params.w || size.params.width;
  }

  if (params.width || params.w) {
    return params.width || params.w;
  }

  if (imageNodeWidth) {
    return imageNodeWidth;
  }

  const imageContainerWidth = getImageContainerWidth(imgNode, config);

  return isCrop ? imageContainerWidth : getSizeLimit(imageContainerWidth, exactSize);
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
 * @param {Number} props.imageNodeHeight - height of image node
 * @param {String} props.params - params of image node
 * @return {Number} height limit
 */
export const getHeight = props => {
  const {
    imgNode = null,
    config = {},
    exactSize = false,
    imageNodeHeight = null,
    params = {},
    size
  } = props;
  const isCrop = params.func === 'crop';

  if (size && size.params) {
    return size.params.h || size.params.height;
  }

  if (params.height || params.h) {
    return params.height || params.h;
  }

  if (imageNodeHeight) {
    return imageNodeHeight;
  }

  if ((params.func || config.params.func) !== 'crop') {
    return null;
  }

  const imageContainerHeight = getImageContainerHeight(imgNode, config);

  return isCrop ? imageContainerHeight : getSizeLimit(imageContainerHeight, exactSize);
};

export const determineContainerProps = props => {
  const { imgNode, config, imageNodeWidth, imageNodeHeight, imageNodeRatio, params, size } = props;
  const { exactSize } = config;
  let width = getWidth({ imgNode, config, exactSize, imageNodeWidth, params, size });
  let height = getHeight({ imgNode, config, exactSize, imageNodeHeight, params, size });
  let ratio = getRatio({ imageNodeRatio, width, height, size });

  if (!height && width && ratio) {
    height = Math.floor(width / ratio);
  }

  if (!width && height && ratio) {
    width = Math.floor(height * ratio);
  }

  return { width, height, ratio };
};

export const getAdaptiveSize = (sizes, config) => {
  const resultSizes = [];

  Object.keys(sizes).forEach(key => {
    const isCustomMedia = key.indexOf(':') > -1;
    const media = isCustomMedia ? key : config.presets[key];

    resultSizes.push({ media, params: normalizeSize(sizes[key]) });
  });

  return resultSizes;
}

export const getFilteredProps = ({ config = {}, alt = '', className = '', src, sizes, width, height, ...otherProps }) => ({
  config,
  alt,
  className,
  imageNodeWidth: width,
  imageNodeHeight: height,
  ...otherProps
});