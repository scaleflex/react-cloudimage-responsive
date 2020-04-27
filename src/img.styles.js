const picture = ({ preserveSize, imgNodeWidth, imgNodeHeight, ratio, previewLoaded, loaded, placeholderBackground, operation }) => ({
  width: getPictureWidth({ operation, preserveSize, imgNodeWidth  }),
  height: getPictureHeight({ operation, preserveSize, imgNodeHeight }),
  position: 'relative',
  background: (!previewLoaded && !loaded && operation !== 'bound') ? placeholderBackground : 'transparent',
  transform: 'translateZ(0)',
  ...(ratio && {
    paddingBottom: preserveSize ? 'none' : (100 / ratio) + '%',
    overflow: 'hidden'
  })
});

const getPictureWidth = ({ operation, preserveSize, imgNodeWidth }) => {
  if (preserveSize && imgNodeWidth) {
    return imgNodeWidth;
  }

  switch (operation) {
    case 'bound': {
      return 'auto';
    }
    default:
      return  '100%';
  }
};

const getPictureHeight = ({ operation, preserveSize, imgNodeHeight }) => {
  if (preserveSize && imgNodeHeight) {
    return imgNodeHeight;
  }

  switch (operation) {
    default:
      return  'auto';
  }
}

const previewWrapper = () => ({
  transform: 'translateZ(0)',
  zIndex: '1',
  height: '100%',
  width: '100%',
  position: 'absolute',
  top: '0',
  left: '0',
  overflow: 'hidden'
});

const previewImg = ({ loaded }) => ({
  opacity: loaded ? 0 : 1,
  height: '100%',
  ...animation(true)
});

const img = ({ isPreview, loaded, operation }) => ({
  display: 'block',
  width: getImgWidth({ operation }),
  ...(getImgPosition({ operation })),
  opacity: 1,
  ...(isPreview ? {} : animation(!loaded))
});

const getImgWidth = ({ operation }) => {
  switch (operation) {
    case 'bound': {
      return 'auto';
    }
    default: {
      return '100%'
    }
  }
};

const getImgPosition = ({ operation }) => {
  switch (operation) {
    case 'bound': {
      return {
        position: 'relative'
      };
    }
    default: {
      return {
        position: 'absolute',
        top: 0,
        left: 0
      }
    }
  }
};

const animation = (isON) => ({
  transform: isON ? `scale(1.1)` : 'scale(1)',
  transition: 'opacity 400ms ease 0ms',
  filter: isON ? `blur(10px)` : 'blur(0)'
});

export default { picture, previewWrapper, previewImg, img };