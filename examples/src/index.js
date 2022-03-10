import { render } from 'react-dom';
import { CloudimageProvider } from '../../src';
import './style.css';
import App from './components/app';


const cloudimageConfig = {
  token: 'demo',
  baseURL: 'https://cloudimage.public.airstore.io/demo/',
  params: 'ci_info=1&org_if_sml=1',
  placeholderBackground: '#e1e1e1',
  limitFactor: 10,
  apiVersion: 'v7',
  lowQualityPreview: {
    minImgWidth: 150,
  },
};

function Start() {
  return (
    <CloudimageProvider config={cloudimageConfig}>
      <App />
    </CloudimageProvider>
  );
}

render(<Start />, document.getElementById('app'));
