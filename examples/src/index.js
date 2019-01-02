import React from 'react';
import { render } from 'react-dom';
import Img, { CloudimageProvider } from '../../src';
import './style.css';
import { images } from './mock';


const cloudimageConfig = {
  token: 'demo',
  baseUrl: 'https://cloudimage.public.airstore.io/demo/',
  filters: 'q80.foil1',
  queryString: '?&size_info=1',
  lazyLoadOffset: 100
};

const App = () => (
  <CloudimageProvider config={cloudimageConfig}>

    <div className="container">
      <h1>Cloudimage React Plugin</h1>
      <p>Cloudimage Responsive plugin
        will <strong>resize</strong>, <strong>compress</strong> and <strong>accelerate</strong> images across the World
        in your <b>React</b> application. It leverages the HTML5 &lt;picture&gt; and &lt;srcset&gt; elements to deliver
        the right image size based on the client's <strong>screen size</strong> and <strong>pixel ratio</strong> (retina
        vs non-retina).</p>

      <h3 style={{ marginTop: 40, marginBottom: 20 }}>
        I. Responsive mode, according to image container size
      </h3>
    </div>

    <Img src={images[0].src} ratio={images[0].ratio}/>

    <div className="container">
      <pre><code>
        <p>&lt;Img src="{images[0].src}" ratio="{images[0].ratio}"/&gt;</p>
      </code></pre>

      <p className="description">
        In this example, image width equals to browser window screen width and is used for calculations.
        Image will be downloaded according to the closest limit (25px, 50px, 100px, 100px * n ). Limit is used for cache
        reasons.
      </p>

      Let's see the numbers:<br/>

      <p className="numbers">
        <b>original image:</b> <i>4.8mb</i> <a href="https://cloudimage.public.airstore.io/demo/magnus-lindvall.jpg"
                                               target="_blank">link</a><br/>
        mobile sizes:<br/>
        <b>400px screen</b> with 1x pixel ratio: <i>31.5kb</i> <a
        href="https://demo.cloudimg.io/width/400/q80.foil1/https://cloudimage.public.airstore.io/demo/magnus-lindvall.jpg"
        target="_blank">link</a><br/>
        <b>400px screen</b> with 2x(Retina) pixel ratio: <i>105kb</i> <a
        href="https://demo.cloudimg.io/width/800/q80.foil1/https://cloudimage.public.airstore.io/demo/magnus-lindvall.jpg"
        target="_blank">link</a><br/>
        laptop sizes:<br/>
        <b>1400px screen</b> with 1x pixel ratio: <i>300kb</i> <a
        href="https://demo.cloudimg.io/width/1400/q80.foil1/https://cloudimage.public.airstore.io/demo/magnus-lindvall.jpg"
        target="_blank">link</a><br/>
        <b>1400px screen</b> with 2x(Retina) pixel ratio: <i>1mb</i> <a
        href="https://demo.cloudimg.io/width/2800/q80.foil1/https://cloudimage.public.airstore.io/demo/magnus-lindvall.jpg"
        target="_blank">link</a><br/>
      </p>

      <p className="description" style={{ marginTop: 15 }}>
        In the examples below, the images will be downloaded according to the closest limit for their container
      </p>

      <div className="row images-in-columns">
        <div className="col-12">
          <Img src={images[8].src} ratio={images[8].ratio}/>
        </div>

        {images.slice(1, 7).map((image, index) => (
          <div key={index} className="col-6">
            <Img src={image.src} ratio={image.ratio}/>
            original: <i>{image.original_size}</i> <a href={`https://cloudimage.public.airstore.io/demo/${image.src}`}
                                                      target="_blank">link</a><br/>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 40, marginBottom: 20 }}>
        II. Manual mode
      </h3>

      <div className="row">
        <div className="col-md-6 col-lg-7">
          <Img
            src={images[18].src}
            operation={'crop'}
            size={{ xl: '1600x1000', lg: '1400x1200', md: '1000x1350', sm: '800x400' }}
          />
          <small>
            original: <i>{images[18].original_size}</i> <a
            href={`https://cloudimage.public.airstore.io/demo/${images[18].src}`} target="_blank">link</a><br/>
          </small>
        </div>
        <div className="col-md-6 col-lg-5 desc-wrapper-with-media-query">
          <h4>You can control your image size/ratio/crop with media query breakpoints</h4>
          <p>Resize your browser window to see how it works</p>
          <pre><code>
            <div>&lt;Img <br/>
              <p>  src="{images[0].src}" <br/>  ratio="{images[0].ratio}"<br/></p>
              <p>  operation="crop"</p>
              <p>  size=&#123;&#123;</p>
              <p>    xl: '1600x1000',</p>
              <p>    lg: '1400x1200',</p>
              <p>    md: '1000x1350',</p>
              <p>    sm: '800x400' </p>
              <p>  &#125;&#125;</p>
              <p>/&gt;</p>
            </div>
          </code></pre>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h4>Any questions?</h4>
        <p>Contact us at hello@cloudimage.io, our image resizing experts will be happy to help!</p>
      </div>
    </div>

  </CloudimageProvider>
);
render(<App/>, document.getElementById("root"));
