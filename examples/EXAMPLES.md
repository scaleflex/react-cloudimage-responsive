## EXAMPLES & WORKAROUNDS


### Cropping

To make the crop automatic `func=crop&gravity=auto` should be set in **params** property

<p align="center">
	<img
		alt="func = crop examples"
		src="https://demo.cloudimg.io/width/1200/n/https://scaleflex.airstore.io/plugins/js-cloudimage-responsive/demo/examples/auto-crop-react.png?v=fb2f13">
</p>

### Integration with Gatsby

React-cloudimage-responsive plugins uses core-js v3 library to add polyfills. Gatsby has some problems with it.
To support the plugin with Gatsby, there is a separate build process which doesn't include polyfills.
You can add them manually in your index.js file before importing the plugin.

The initialization process is the same, the only difference you need to import **components** and **provider** with `react-cloudimage-responsive/dist/gatsby`;

For example

```jsx
import Img, { CloudimageProvider } from "react-cloudimage-responsive/dist/gatsby";
```

