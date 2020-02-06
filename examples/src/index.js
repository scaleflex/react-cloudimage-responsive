import React, { Component } from 'react';
import { render } from 'react-dom';
import Img, { CloudimageProvider } from '../../src';
import './style.css';
import './assets/fonts/helvetica-neue.css';
import { images } from './mock';
import ContainerBox from './components/ContainerBox';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';


const cloudimageConfig = {
  token: 'scaleflex',
  baseURL: 'https://cloudimage.public.airstore.io/demo/',
  params: 'ci_info=1&org_if_sml=1',
  placeholderBackground: '#e1e1e1'
};


class App extends Component {
  render() {
    return (
      <CloudimageProvider config={cloudimageConfig}>
        <section className="home">
          <div className="container">
            <a
              className="logo"
              href="https://scaleflex.github.io/react-cloudimage-responsive/">
              React Cloudimage Responsive
            </a>
            <div className="reference-buttons">
              <a className="github-button" target="_blank"
                 href="https://github.com/Scaleflex/react-cloudimage-responsive/subscription" data-icon="octicon-eye"
                 aria-label="Watch Scaleflex/react-cloudimage-responsive on GitHub">Watch</a>
              <a className="github-button" target="_blank"
                 href="https://github.com/Scaleflex/react-cloudimage-responsive"
                 data-icon="octicon-star" aria-label="Star Scaleflex/react-cloudimage-responsive on GitHub">Star</a>
              <a className="github-button" target="_blank"
                 href="https://github.com/Scaleflex/react-cloudimage-responsive/fork"
                 data-icon="octicon-repo-forked"
                 aria-label="Fork Scaleflex/react-cloudimage-responsive on GitHub">Fork</a>
              <a className="twitter-share-button btn btn-info" target="_blank"
                 href="https://twitter.com/intent/tweet?text=Responsive%20images,%20now%20easier%20than%20ever&url=https://scaleflex.github.io/react-cloudimage-responsive/&via=cloudimage&hashtags=images,cloudimage,responsive_images,lazy_loading,web_acceleration,image_optimization,image_CDN,image_CDNwebp,jpeg_xr,jpg_optimization,image_resizing_and_CDN,cropresize">
                <i> </i>
                <span>Tweet</span>
              </a>
            </div>
            <h1><strong>Responsive images</strong>, now easier than ever.</h1>
            <h2>
              Make your existing images <strong>responsive</strong> without creating new
              images. <strong>Upload</strong> one
              high quality original image and the plugin will <strong>resize, compress and accelerate</strong> images
              across
              the World in your site for all devices. The plugin supports <strong>lazy load</strong> with <strong>fancy
              animation</strong> on image load.
            </h2>


            <div className="actions-wrapper">
              <a
                id="view-github-btn"
                href="https://github.com/scaleflex/react-cloudimage-responsive"
                className="btn btn-primary"
                target="_blank"
              >View on GitHub</a>
              <a
                href="https://codesandbox.io/s/1840nl707j"
                style={{ marginLeft: 5 }}
                className="btn btn-light"
                target="_blank"
              >Edit on CodeSandbox</a>
              {/*//<!--<a href="#" class="btn btn-light btn-lg">Read on Medium</a>-->*/}
            </div>
          </div>

          <a href="https://github.com/scaleflex/react-cloudimage-responsive" target="_blank">
            <img
              className="fork-me-on-github"
              src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
              alt="Fork me on GitHub"/>
          </a>

          <a href="https://www.filerobot.com/" className="robot-icon">
            <img style={{ width: '100%' }} id="robot-icon"
                 src="https://demo.cloudimg.io/width/800/q35.foil1/https://scaleflex.airstore.io/filerobot/assets/robot-icon-left.png"
                 alt=""/>
          </a>
        </section>

        <section>
          <ContainerBox/>
          <Img src={images[0].src} ratio={images[0].ratio}/>
        </section>

        <div style={{ background: '#fff' }}>
          <section className="container ready-to-start">
            <h2 className="text-center">Features</h2>

            <ul>
              <li><strong>Resize large images</strong> to the size needed by your design and
                <strong>generate multiple images</strong> for different device screen size
              </li>
              <li>Strip all unnecessary metadata and <strong>optimize JPEG, PNG and GIF compression</strong></li>
              <li>Efficiently <strong>lazy load images</strong> to speed initial page load and save bandwidth</li>
              <li>Use the low quality image with "blur-up" technique to <strong>show a preview</strong> of the image
                <strong>while it loads</strong></li>
              <li><strong>Hold the image position</strong> so your page doesn't jump while images load</li>
            </ul>

          </section>
        </div>

        <section className="container ready-to-start">
          <h2 className="text-center">How it works</h2>
          <p>
            The plugin detects the <strong>width of image's container</strong> and <strong>pixel ratio{' '}
            density</strong> of{' '}
            your device to load the exact image size you need. It <strong>processes</strong> images via{' '}
            <a href="https://www.cloudimage.io/en/home">Cloudimage.io</a> service which offers
            comprehensive <strong>automated{' '}
            image optimization</strong> solutions.
          </p>
          <p style={{ marginTop: 20 }}>
            When an image is first loaded on your website or mobile app, Cloudimage's resizing servers will{' '}
            <strong>download</strong> your origin image from your origin server, <strong>resize</strong> it and{' '}
            <strong>deliver</strong> to your user via lightning-fast Content Delivery Networks (CDNs). Once the image
            is{' '}
            resized in the format of your choice, Cloudimage will send it to a Content Delivery Network, which will in
            turn{' '}
            deliver it rocket fast to your visitors, <strong>responsively across various screen sizes</strong>.
          </p>
          <p style={{ marginTop: 20 }}>
            Read the following <a href="https://medium.com/cloudimage/cloudimage-resizes-your-images-saves-time-accelerates-your-website-and-increases-your-conversion-eb128903d4c2">article</a> to learn more about Cloudimage.io service.
          </p>
        </section>

        <div style={{ background: '#fff' }}>
          <section className="container ready-to-start">
            <h2 className="text-center">In numbers</h2>

            <p>
              We have original image stored via CDN with <strong>6240×4160 px resolution</strong> and{' '}
              <strong>8.7 mb size</strong>:{' '}
              <code>https://scaleflex.airstore.io/demo/redcharlie.jpg</code>{' '}
              <a target="_blank" href="https://scaleflex.airstore.io/demo/redcharlie.jpg">link</a>{' '}
              In the table below we can see what size and resolution will be loaded depending on the image's container.
            </p>

            <table className="table table-bordered">
              <thead>
              <tr>
                <th>container size</th>
                <th>pixel ratio density</th>
                <th>calculated width</th>
                <th>result: dimantion | size | link</th>
              </tr>
              </thead>
              <tbody>

              <tr>
                <td rowSpan="2" style={{ verticalAlign: 'middle' }}>
                  400px
                </td>
                <td>1</td>
                <td>400px</td>
                <td>400×267 | 18.7 kb | <a target="_blank"
                                           href="https://demo.cloudimg.io/width/400/q35.foil1/https://scaleflex.airstore.io/demo/redcharlie.jpg">link</a>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>800px</td>
                <td>800×533 | 58.1 kb | <a target="_blank"
                                           href="https://demo.cloudimg.io/width/800/q35.foil1/https://scaleflex.airstore.io/demo/redcharlie.jpg">link</a>
                </td>
              </tr>

              <tr>
                <td rowSpan="2" style={{ verticalAlign: 'middle' }}>
                  570px
                </td>
                <td>1</td>
                <td>600px</td>
                <td>600×400 | 35.4 kb | <a target="_blank"
                                           href="https://demo.cloudimg.io/width/600/q35.foil1/https://scaleflex.airstore.io/demo/redcharlie.jpg">link</a>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>1200px</td>
                <td>1200x800 | 119 kb | <a target="_blank"
                                           href="https://demo.cloudimg.io/width/1200/q35.foil1/https://scaleflex.airstore.io/demo/redcharlie.jpg">link</a>
                </td>
              </tr>


              <tr>
                <td rowSpan="2" style={{ verticalAlign: 'middle' }}>
                  720px
                </td>
                <td>1</td>
                <td>800px</td>
                <td>800×533 | 58.1 kb | <a target="_blank"
                                           href="https://demo.cloudimg.io/width/800/q35.foil1/https://scaleflex.airstore.io/demo/redcharlie.jpg">link</a>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>1600px</td>
                <td>1600px×1066 | 200 kb | <a target="_blank"
                                              href="https://demo.cloudimg.io/width/1600/q35.foil1/https://scaleflex.airstore.io/demo/redcharlie.jpg">link</a>
                </td>
              </tr>

              <tr>
                <td rowSpan="2" style={{ verticalAlign: 'middle' }}>
                  1170px
                </td>
                <td>1</td>
                <td>1200px</td>
                <td>1200x800 | 119 kb | <a target="_blank"
                                           href="https://demo.cloudimg.io/width/1200/q35.foil1/https://scaleflex.airstore.io/demo/redcharlie.jpg">link</a>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>2400px</td>
                <td>2400x1600 | 405 kb | <a target="_blank"
                                            href="https://demo.cloudimg.io/width/2400/q35.foil1/https://scaleflex.airstore.io/demo/redcharlie.jpg">link</a>
                </td>
              </tr>

              </tbody>

            </table>

            <p>
              * The plugin <strong>rounds container width</strong> to next possible value which can be divided by
              100{' '}
              without the remainder. It's done for <strong>cache reasons</strong> so that we cache not all images
              different by{' '}
              1px, but only 100px, 200px, 300px …
            </p>
          </section>
        </div>

        <section className="ready-to-start">
          <div className="container">
            <h2 className="text-center">Gallery demo</h2>

            <p>Change the size of your browser's window and reload the page to see how the Cloudimage Responsive
              plugin{' '}
              will deliver an optimized image for the screen size.</p>
          </div>

          <div className="container-fluid"
               style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', paddingTop: 20 }}>

            <div className="row images-in-columns">
              <div className="col-12">
                <ContainerBox/>
                {/*<BackgroundImg src={images[8].src} params="func=crop" width={500} height={200}>*/}
                {/*  <div className="container">*/}
                {/*    <h2 className="text-center">Gallery demo</h2>*/}

                {/*    <p>Change the size of your browser's window and reload the page to see how the Cloudimage Responsive*/}
                {/*      plugin{' '}*/}
                {/*      will deliver an optimized image for the screen size.</p>*/}
                {/*  </div>*/}
                {/*</BackgroundImg>*/}
                <Img src={images[8].src} ratio={images[8].ratio}/>
              </div>

              {images.slice(1, 7).map((image, index) => (
                <div key={index} className="col-6">
                  <ContainerBox/>
                  <Img src={image.src} ratio={image.ratio}/>
                  original: <i>{image.original_size}</i> <a
                  href={`https://cloudimage.public.airstore.io/demo/${image.src}`}
                  target="_blank">link</a><br/>
                </div>
              ))}
            </div>

            <div className="row">
              <div className="col-md-6 col-lg-7">
                <Img
                  src={images[18].src}
                  params={'func=crop'}
                  sizes={{
                    sm: { w: 400, h: 200 },
                    '(min-width: 620px)': { w: 200, h: 60 },
                    md: { w: 250, h: 350 },
                    lg: { w: 350, h: 300 },
                    xl: { w: 400, h: 250 }
                  }}
                />
                <small>
                  original: <i>{images[18].original_size}</i> <a
                  href={`https://cloudimage.public.airstore.io/demo/${images[18].src}`} target="_blank">link</a><br/>
                </small>
              </div>
              <div className="col-md-6 col-lg-5 desc-wrapper-with-media-query">
                <h4>You can control your image size/ratio/crop with media query breakpoints</h4>
                <p>Resize your browser window to see how it works</p>
                <SyntaxHighlighter language='jsx' style={darcula}>
                  {`<Img
  src={images[18].src}
  operation={'crop'}
  size="
    sm 400x200,
    (min-width: 620px) 200x60,
    md 250x350,
    lg 350x300,
    xl 400x250
  "
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section className="container ready-to-start">
          <h2 className="text-center">Ready to get started?</h2>
          <p>To use the plugin, you will need a Cloudimage token. Don't worry, it only takes seconds to get one by
            registering{' '}
            <a
              href="https://www.cloudimage.io/en/register_page">here</a>. Once your token is created, you can
            configure{' '}
            it as described below.{' '}
            This token allows you to use 25GB of image cache and 25GB of worldwide CDN traffic per month for free.</p>
        </section>

        <section className="container">
          <div className="text-center">
            <div id="plugin-version-switcher" className="plugin-version-switcher btn-group btn-toggle">
              {/*//<!--<button id="js-btn" class="btn btn-primary">JS version</button>-->*/}
              {/*//<!--<a href="#" class="btn btn-light">React version</a>-->*/}
              {/*//<!--<a href="#" class="btn btn-light">Angular version</a>-->*/}
            </div>
          </div>

          <div id="js-version-box">
            <div className="action-wrapper first-action">
              <p>Install using npm</p>
              <figure className="highlight">
                <pre><code className="javascript">npm install --save react-cloudimage-responsive</code></pre>
              </figure>
            </div>

            <div>
              <div className="action-wrapper second-action">
                <p>
                  initialize it with your <strong>token</strong> and the <strong>baseUrl</strong> of your image
                  storage{' '}
                  using <strong>CloudimageProvider</strong>
                </p>
                <SyntaxHighlighter language='jsx' style={darcula}>{`import React from 'react';
import { render } from 'react-dom';
import Img, { CloudimageProvider } from 'react-cloudimage-responsive';

const cloudimageConfig = {
  token: 'demo',
  baseUrl: 'https://jolipage.airstore.io/'
};

const App = () => {
  return (
    <CloudimageProvider config={cloudimageConfig}>
      <h1>Simple demo of react-cloudimage-responsive</h1>
      <Img src="img.jpg" alt="Demo image" ratio={1.5}/>
    </CloudimageProvider>
  );
};

render(<App />, document.body);`}</SyntaxHighlighter>
                <p>
                  Get your Cloudimage tokens <a href="https://www.cloudimage.io/en/register_page">here</a>.
                </p>
              </div>


              <div className="action-wrapper third-action">
                <p>
                  Implement it, just using the Img component:
                </p>
                <SyntaxHighlighter language='jsx' style={darcula}>
                  {`<Img src="img.jpg" alt="Demo image" ratio={1.5}/>`}
                </SyntaxHighlighter>
                <p>
                  <small>NOTE: "ratio" is recommended to prevent page layout jumping.{' '}
                    The parameter is used to calculate image height to hold the image position while image is loading.
                  </small>
                </p>
              </div>

              <div className="action-wrapper forth-action">
                <p>
                  …and you're done!{' '}
                  <a href="https://github.com/scaleflex/react-cloudimage-responsive#table-of-contents"
                     target="_blank">{' '}
                    Visit the full documentation here.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ textAlign: 'center' }}>
          <div className="container ready-to-start">
            <h2>Any questions?</h2>
            <p>Contact us at <a href="mailto:hello@cloudimage.io">hello@cloudimage.io</a>, our experts will be happy to
              help!
            </p>
          </div>
        </section>

        <footer>
          <div style={{ background: '#fff' }}>
            <section className="container ready-to-start filerobot-ui-family">
              <div className="row">
                <div className="col-sm-3 filerobot-ui-family-label" style={{maxWidth: 200, minWidth: 200}}>
                  <h5>Filerobot UI family:</h5>
                </div>
                <div className="col-sm-9 filerobot-ui-family-libs" style={{maxWidth: 'calc(100% - 200px)'}}>
                  <ul>
                    <li><a target="_blank" href="https://github.com/scaleflex/js-cloudimage-responsive">JS Cloudimage Responsive</a></li>
                    <li><a target="_blank" href="https://github.com/scaleflex/ng-cloudimage-responsive">Angular Cloudimage Responsive</a></li>
                    <li><a target="_blank" href="https://github.com/scaleflex/js-cloudimage-360-view">JS Cloudimage 360 view</a></li>
                    <li><a target="_blank" href="https://github.com/scaleflex/filerobot-uploader">Uploader</a></li>
                    <li><a target="_blank" href="https://github.com/scaleflex/filerobot-image-editor">Image Editor</a></li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
          <hr/>
          <div className="copyright">
            <div className="container">
              <div className="row">
                <div className="team-desc col-sm-8">
                  <div>Made with ❤ in 2019 in Paris, Munich and Sofia by the Scaleflex team, the guys behind <a
                    href="https://www.cloudimage.io/en/home" target="_blank">Cloudimage.io</a>.
                  </div>
                  <div style={{ marginTop: 10 }}>Powered by <a href="https://www.scaleflex.it/en/home"
                                                               target="_blank">Scaleflex team</a>.
                    All rights reserved.
                  </div>
                </div>
                <div className="footer-menu col-sm-4">
                  <ul>
                    <li><a href="https://github.com/scaleflex/react-cloudimage-responsive" target="_blank">View
                      GitHub</a></li>
                    <li><a href="https://github.com/scaleflex/react-cloudimage-responsive/issues" target="_blank">Current
                      Issues</a>
                    </li>
                    <li><a href="https://github.com/scaleflex/react-cloudimage-responsive#table-of-contents"
                           target="_blank">Documentation</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <div id="device-pixel-ratio" className="device-pixel-ratio">
          Your device pixel ratio: <span>{Math.round(window.devicePixelRatio || 1)}</span>
        </div>

      </CloudimageProvider>
    )
  }
}

render(<App/>, document.getElementById("app"));
