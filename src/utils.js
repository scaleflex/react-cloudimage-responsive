export const getFilteredProps = ({ config = {}, alt = '', className = '', src, sizes, width, height, params, ...otherProps }) => ({
  alt,
  className,
  imgNodeWidth: width,
  imgNodeHeight: height,
  ...otherProps
});

export const getFilteredBgProps = ({ config = {}, alt = '', className = '', src, sizes, width, height, params, ...otherProps }) => ({
  alt,
  className,
  ...otherProps
});