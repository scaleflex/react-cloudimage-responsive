[![Release](https://img.shields.io/badge/release-v3.0.1-blue.svg)](https://github.com/scaleflex/react-cloudimage-responsive/releases)
[![Free plan](https://img.shields.io/badge/price-includes%20free%20plan-green.svg)](https://www.cloudimage.io/en/home#b38181a6-b9c8-4015-9742-7b1a1ad382d5)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)](#contributing)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Scaleflex team](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-the%20Scaleflex%20team-6986fa.svg)](https://www.scaleflex.it/en/home)

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Responsive%20images,%20now%20easier%20than%20ever&url=https://scaleflex.github.io/react-cloudimage-responsive/&via=cloudimage&hashtags=react,images,cloudimage,responsive_images,lazy_loading,web_acceleration,image_optimization,image_CDN,image_CDNwebp,jpeg_xr,jpg_optimization,image_resizing_and_CDN,cropresize)

<p align="center">
	<img
		height="175"
		alt="The Lounge"
		src="https://demo.cloudimg.io/height/350/n/https://scaleflex.airstore.io/filerobot/filerobot-cloudimage.png?sanitize=true">
</p>

<h1 align="center">
   React Cloudimage Responsive
</h1>

<p align="center">
	<strong>
		<a href="#table_of_contents">Docs</a>
		•
		<a href="https://scaleflex.github.io/react-cloudimage-responsive/" target="_blank">Demo</a>
		•
		<a href="https://codesandbox.io/s/1840nl707j" target="_blank">Code Sandbox</a>
		•
		<a href="https://medium.com/@dmitry_82269/responsive-images-in-2019-now-easier-than-ever-b76e5a43c074" target="_blank">Why?</a>
	</strong>
</p>

This plugin detects the width of any image container as well as the device pixel ratio
density to load the optimal image size needed.
Images are resized on-the-fly via the <a href="https://cloudimage.io" target="_blank">Cloudimage service</a>, thus offering a comprehensive
automated image optimization service.

When an image is first loaded on your website or mobile app,
Cloudimage's resizing servers will download the origin image from
the source, resize it for the client's screen size and deliver to your users through one or multiple
Content Delivery Networks (CDNs). The generated image formats are cached in the CDN and will be delivered rocket fast on any subsequent request.

**NOTE:** Your original (master) images should be stored on a server
or storage bucket (S3, Google Cloud, Azure Blob...) reachable over
HTTP or HTTPS by Cloudimage. If you want to upload your master images to
Cloudimage, contact us at
[hello@cloudimage.io](mailto:hello@cloudimage.io).

<p align="center">
	<img
		alt="The Lounge"
		src="https://demo.cloudimg.io/width/1400/n/https://scaleflex.airstore.io/filerobot/cloudimage-process.jpg?sanitize=true">
</p>

powered by [Cloudimage](https://www.cloudimage.io/)
([Watch the video here](https://www.youtube.com/watch?time_continue=2&v=JFZSE1vYb0k))

## Table of contents

* [Demo](#demo)
* [Requirements](#requirements)
* [Step 1: Installation](#installation)
* [Step 2: Initialize](#initialize)
* [Step 3: Implement](#implement)
* [Configuration](#configuration)
* [Image properties](#image_properties)
* [Browser support](#browser_support)
* [Filerobot UI Family](#ui_family)
* [Contributing](#contributing)
* [License](#license)


## <a name="demo"></a> Demo

To see the Cloudimage Responsive plugin in action, please check out the
[Demo page](https://scaleflex.github.io/react-cloudimage-responsive/).
Play with your browser's window size and observe your
Inspector's Network tab to see how Cloudimage delivers the optimal
image size to your browser, hence accelerating the overall page
loading time.

## <a name="requirements"/> Requirements

To use the Cloudimage Responsive plugin, you will need a
Cloudimage token to deliver your images over CDN. Don't worry, it only takes seconds to get one by
registering [here](https://www.cloudimage.io/en/register_page).
Once your token is created, you can configure it as described below.
This token allows you to use 25GB of image cache and 25GB of worldwide
CDN traffic per month for free.

## <a name="installation"></a>Step 1: Installation

using npm

```
$ npm install --save react-cloudimage-responsive
```

## <a name="initialize"></a>Step 2: Initialize

After installing the react-cloudimage-responsive lib, simply initialize it with your **token** and the **baseURL**
of your image storage with **CloudimageProvider**:

```jsx
import React from 'react';
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

render(<App />, document.body);
```

## <a name="implement"></a>Step 3: Implement it

### Img component:

```html
<Img src="img.jpg" alt="Demo image" ratio={1.5}/>
```

NOTE: "ratio" is recommended to prevent page layout jumping. The parameter is used to calculate image height to hold
the image position while image is loading.

<a href="https://codesandbox.io/s/1840nl707j"><img src="https://codesandbox.io/static/img/play-codesandbox.svg" alt="edeit in codesandbox"/></a>

### BackgroundImg component:

```html
<BackgroundImg src="img.jpg">
 {'Your conent...'}
</BackgroundImg>
```

<a href="https://codesandbox.io/s/react-cloudimage-responsive-background-1nin8"><img src="https://codesandbox.io/static/img/play-codesandbox.svg" alt="edeit in codesandbox"/></a>

## <a name="configuration"></a> Config

### token

###### Type: **String** | Default: **"demo"** | _required_

Your Cloudimage customer token.
[Subscribe](https://www.cloudimage.io/en/register_page) for a
Cloudimage account to get one. The subscription takes less than a
minute and is totally free.

### baseURL

###### Type: **String** | Default: **"/"** | _optional_

Your image folder on server, this alows to shorten your origin image URLs.

### doNotReplaceURL

###### Type: **bool** | Default: **false**

If set to **true** the plugin will only add query params to the given source of image.

### <a name="lazy_loading_config"></a>lazyLoading

###### Type: **Bool** | Default: **true** | _optional_

Only images close to the client's viewport will be loaded, hence accelerating the page loading time. The plugin uses
[react-lazyload](https://github.com/twobin/react-lazyload) library to achieve it.

### imgLoadingAnimation

###### Type: **Bool** | Default: **true** | _optional_

Applies a nice interlacing effect for preview transition

### params

###### Type: **String** | Default: **'org_if_sml=1'** | _optional_

Applies default Cloudimage operations/ filters to your image, e.g. brightness, contrast, rotation...
Multiple params can be applied, separated by "```&```" e.g. wat_scale=35&wat_gravity=northeast&wat_pad=10&grey=1

```javascript
params: 'org_if_sml=1'
```

#### alternative syntax: type: **Object**

```javascript
params: {
    org_if_sml: 1,
    grey: 1,
    ...
}
```

[Full cloudimage v7 documentation here.](https://docs.cloudimage.io/go/cloudimage-documentation-v7/en/introduction)


### placeholderBackground

###### Type: **String** | Default: **'#f4f4f4'** | _optional_

Placeholder colored background while the image is loading or use it to set your custom placeholder image or gif

for example

```placeholderBackground: "url('https://scaleflex.airstore.io/filerobot/red-loader.gif') 50% 50% no-repeat"```

### presets

###### Type: **Object**

Default:

```javascript
const cloudimageConfig = {
  token: 'demo',
  baseUrl: 'https://jolipage.airstore.io/',
  ...
  presets: {
      xs: '(max-width: 575px)', // up to 575    PHONE
      sm: '(min-width: 576px)', // 576 - 767    PHABLET
      md: '(min-width: 768px)', // 768 - 991    TABLET
      lg: '(min-width: 992px)', // 992 - 1199   SMALL_LAPTOP_SCREEN
      xl: '(min-width: 1200px)' // from 1200    USUALSCREEN
  }
};
```

Breakpoints shortcuts to use in image size property, can be overwridden.

## <a name="image_properties"></a> Image properties

### src

###### Type: **String** | Default: **undefined** | _required_

Original image hosted on your web server. You can use absolute path or
relative to baseUrl in your config.

**NOTES:**

The plugin uses a special algorithm to detect the width of image container and set the image size accordingly.
This is the recommended way of using the Cloudimage Responsive plugin.

### sizes

###### Type: **Object** | Default: **undefined**

**{preset breakpoint (xs,sm, md,lg,xl) or media query + ' ' + image params}**:

```jsx
<Img
  src="dino-reichmuth-1.jpg"
  sizes={{
      sm: { w: 400, h: 200 },
      '(min-width: 620px)': { w: 200, h: 60 },
      md: { w: 250, h: 350 },
      lg: { w: 350, h: 300 },
      xl: { w: 400, h: 250 }
 }}/>
```

You can drop some breakpoints, for example:

```jsx
<Img
  src="dino-reichmuth-1.jpg"
  sizes={{
      sm: { w: 400, h: 200 },
      '(min-width: 620px)': { w: 200, h: 60 }
 }}/>
```

**NOTE:** if size is not set, the plugin uses a special algorithm to
detect the width of image container and set the image size accordingly. This is the recommended way of using the Cloudimage Responsive plugin.

### ratio

###### Type: **Number** | _optional_

It is recommended to prevent page layout jumping. The parameter is used to calculate image height to hold
the image position while image is loading.

### lazyLoading

###### Type: **Bool** | _optional_

Make it possible to disable lazyLoading for each image.

### lazyLoadConfig

###### Type: **Object** | _optional_

The lazyLoad configuration to [LazyLoad](https://github.com/twobin/react-lazyload#props) component. 

To see the full cloudimage documentation [click here](https://docs.cloudimage.io/go/cloudimage-documentation)

## <a name="browser_support"></a>Browser support

Tested in all modern browsers and IE 11.

## <a name="ui_family"></a>Filerobot UI Familiy

* [JS Cloudimage Responsive](https://github.com/scaleflex/js-cloudimage-responsive)
* [Angular Cloudimage Responsive](https://github.com/scaleflex/ng-cloudimage-responsive)
* [JS Cloudimage 360 view](https://github.com/scaleflex/js-cloudimage-360-view)
* [Image Editor](https://github.com/scaleflex/filerobot-image-editor)
* [Uploader](https://github.com/scaleflex/filerobot-uploader)

## <a name="contributing"></a>Contributing!

All contributions are super welcome!


## <a name="license"></a>License
React Cloudimage Responsive is provided under the [MIT License](https://opensource.org/licenses/MIT)
