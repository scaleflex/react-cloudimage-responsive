import ReactDOM from 'react-dom/client';
import { CloudimageProvider } from '../../src';
import './style.css';
import App from './components/app';


const cloudimageConfig = {
  token: 'demo',
  baseURL: 'https://scaleflex.cloudimg.io/v7/demo/',
  doNotReplaceURL: true,
  params: 'ci_info=1&org_if_sml=1',
  placeholderBackground: '#e1e1e1',
  limitFactor: 10,
  lowQualityPreview: {
    minImgWidth: 150,
  },
};

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  <CloudimageProvider config={cloudimageConfig}>
    <App />
  </CloudimageProvider>,
);
