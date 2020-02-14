const container = ({ style, cloudimgURL }) => ({
  position: 'relative',
  ...style,
  backgroundImage: `url(${cloudimgURL})`
});

const previewBgWrapper = ({ loaded }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'inherit',
  transition: 'opacity 400ms ease 0ms',
  transform: 'translateZ(0)',
  overflow: 'hidden',
  opacity: loaded ? '0' : '1'
});

const previewBg = ({ previewCloudimgURL }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'inherit',
  backgroundImage: `url(${previewCloudimgURL})`,
  transform: 'scale(1.1)',
  filter: `blur(10px)`
});

export default { container, previewBgWrapper, previewBg }