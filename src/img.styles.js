const picture = ({ preserveSize, imgNodeWidth, imgNodeHeight, ratio, previewLoaded, loaded, placeholderBg }) => ({
  width: preserveSize && imgNodeWidth ? imgNodeWidth : '100%',
  height: preserveSize && imgNodeHeight ? imgNodeHeight : 'auto',
  paddingBottom: preserveSize ? 'none' : (100 / ratio) + '%',
  position: 'relative',
  background: (!previewLoaded && !loaded) ? placeholderBg : 'transparent',
  transform: 'translateZ(0)',
  overflow: 'hidden'
});

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

const previewImg = ({ loaded, width }) => ({
  opacity: loaded ? 0 : 1,
  ...animation(width, true)
});

const img = ({ isPreview, loaded, width }) => ({
  display: 'block',
  width: '100%',
  position: 'absolute',
  opacity: 1,
  top: 0,
  left: 0,
  ...(isPreview ? {} : animation(width, !loaded))
});

const animation = (width, isON) => ({
  transform: isON ? `scale(1.1)` : 'scale(1)',
  transition: 'opacity 400ms ease 0ms',
  filter: isON ? `blur(${Math.floor(width / 100)}px)` : 'blur(0)'
});

export default { picture, previewWrapper, previewImg, img };