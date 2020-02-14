import './polyfills';
import React from 'react';
import ImgComponent from './img.component';
import BackgroundImgComponent from './background.component';
import CloudimageProvider, { CloudimageContext } from './provider';


const Img = (props = {}) => {
  return (
    <CloudimageContext.Consumer>
      {(context = {}) => <ImgComponent {...props} config={context.config}/>}
    </CloudimageContext.Consumer>
  )
}

const BackgroundImg = (props = {}) => {
  return (
    <CloudimageContext.Consumer>
      {(context = {}) => <BackgroundImgComponent {...props} config={context.config }/>}
    </CloudimageContext.Consumer>
  )
}

export default Img;

export { CloudimageProvider, Img, BackgroundImg };
