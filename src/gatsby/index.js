import React from 'react';
import ImgComponent from '../img';
import BackgroundImgComponent from '../background';
import CloudimageProvider, { CloudimageContext } from '../provider';


const Img = (props = {}) => {
  return (
    <CloudimageContext.Consumer>
      {(context = {}) => <ImgComponent {...props} config={context.cloudImageConfig}/>}
    </CloudimageContext.Consumer>
  )
}

const BackgroundImg = (props = {}) => {
  return (
    <CloudimageContext.Consumer>
      {(context = {}) => <BackgroundImgComponent {...props} config={context.cloudImageConfig }/>}
    </CloudimageContext.Consumer>
  )
}

export default Img;

export { CloudimageProvider, Img, BackgroundImg };
