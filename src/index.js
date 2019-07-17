import './polyfills';
import React from 'react';
import Img from './img.component';
import CloudimageProvider, { CloudimageContext } from './Provider';


const ImgWrapper = (props) => {
  return (
    <CloudimageContext.Consumer>
      {(context) => <Img {...props} config={context.config}/>}
    </CloudimageContext.Consumer>
  )
}

export default ImgWrapper;

export { CloudimageProvider };
