const picture = ({ preserveSize, imgNodeWidth, imgNodeHeight, ratio, previewLoaded, loaded, placeholderBackground }) => ({
  width: preserveSize && imgNodeWidth ? imgNodeWidth : '100%',
  height: preserveSize && imgNodeHeight ? imgNodeHeight : 'auto',
  position: 'relative',
  background: (!previewLoaded && !loaded) ? placeholderBackground : 'transparent',
  transform: 'translateZ(0)',
  ...(ratio && {
    paddingBottom: preserveSize ? 'none' : (100 / ratio) + '%',
    overflow: 'hidden'
  })
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

const previewImg = ({ loaded }) => ({
  opacity: loaded ? 0 : 1,
  width: '100%',
  ...animation(true)
});

const img = ({ isPreview, loaded }) => ({
  display: 'block',
  width: '100%',
  position: 'absolute',
  opacity: 1,
  top: 0,
  left: 0,
  ...(isPreview ? {} : animation(!loaded))
});

const animation = (isON) => ({
  transform: isON ? `scale(1.1)` : 'scale(1)',
  transition: 'opacity 400ms ease 0ms',
  filter: isON ? `blur(10px)` : 'blur(0)'
});

export default { picture, previewWrapper, previewImg, img };