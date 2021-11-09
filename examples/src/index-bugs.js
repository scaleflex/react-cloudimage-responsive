import React, { Component } from 'react';
import { render } from 'react-dom';
import Img, { CloudimageProvider, BackgroundImg } from '../../src';
//import './style.css';
//import { images } from './mock';
//import ContainerBox from './components/container-box';
//import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
//import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';


const cloudimageConfig = {
  token: 'demo',
  baseURL: 'https://cloudimage.public.airstore.io/demo/',
  params: 'ci_info=1&org_if_sml=1',
  apiVersion: 'v7',
  placeholderBackground: '#e1e1e1',
  limitFactor: 10
};

const src =
  "https://images-development.catchandrelease.com/photo_files/photos/file-3ea7d38503cc6609f31700d453c62a54.jpg";

class App extends Component {
  render() {
    return (
      <CloudimageProvider config={cloudimageConfig}>
        <div className="App">
          Correct Result Image
          <Img src={src} height={200} params="func=bound" alt="Demo"/>
          {/*<div>*/}
          {/*  <img src={src} alt="Demo" style={{ height: "100px" }} />*/}
          {/*</div>*/}
          {/*<div style={{ margin: "20px" }}>*/}
          {/*  == Image 1 (no load w/out ratio) ==*/}
          {/*  <Img src={src} alt="Demo" />*/}
          {/*  == End Image 1 ==*/}
          {/*</div>*/}
          {/*<div style={{ maxHeight: "50px", margin: "20px" }}>*/}
          {/*  == Image 2 (no load) ==*/}
          {/*  <Img src={src} alt="Demo" params={{ height: 100, func: "bound" }} />*/}
          {/*  == End Image 2 ==*/}
          {/*</div>*/}
          {/*<div style={{ height: "100px", margin: "20px", overflow: "hidden" }}>*/}
          {/*  == Image 3 (loads, but not sized) ==*/}
          {/*  <Img src={src} ratio={1} alt="Demo" />*/}
          {/*  == End Image 3 ==*/}
          {/*</div>*/}
          {/*<div style={{ height: "100px", margin: "20px", overflow: "hidden" }}>*/}
          {/*  == Image 4 (Loads, Ignores params) ==*/}
          {/*  <Img*/}
          {/*    src={src}*/}
          {/*    ratio={1.0}*/}
          {/*    alt="Demo"*/}
          {/*    params={{ h: 100, func: "bound" }}*/}
          {/*  />*/}
          {/*  == End Image 4 ==*/}
          {/*</div>*/}
          {/*<div style={{ height: "100px", width: "100px", margin: "20px" }}>*/}
          {/*  == Image 5 (Works, but need to know the image size for every image and*/}
          {/*  define all sizes and width seems to be 100 instead of 80) ==*/}
          {/*  <Img*/}
          {/*    src={src}*/}
          {/*    sizes={{*/}
          {/*      xl: { w: 80, h: 100 },*/}
          {/*      lg: { w: 80, h: 100 },*/}
          {/*      md: { w: 80, h: 100 },*/}
          {/*      sm: { w: 80, h: 100 },*/}
          {/*      xs: { w: 80, h: 100 }*/}
          {/*    }}*/}
          {/*    alt="Demo"*/}
          {/*  />*/}
          {/*  == Image 5 (Loads, Ignores params) ==*/}
          {/*</div>*/}
        </div>

        <div id="device-pixel-ratio" className="device-pixel-ratio">
          Your device pixel ratio: <span>{(window.devicePixelRatio || 1).toFixed(1)}</span>
        </div>

      </CloudimageProvider>
    )
  }
}

render(<App/>, document.getElementById("app"));
