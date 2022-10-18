declare module 'react-cloudimage-responsive' {

  type Params = string | Record<string, string>;

  export interface CloudimageProviderConfig {
    token: string;
    baseURL?: string;
    doNotReplaceURL?: boolean;
    lazyLoading?: boolean;
    lazyLoadOffset?: number;
    params?: Params;
    placeholderBackground?: string;
    lowQualityPreview?: {
      minImgWidth: number;
    }
    presets?: Record<string, string>;
    limitFactor?: number;
    devicePixelRatioList?: number[];
    delay?: number;
  }

  class CloudimageProvider extends React.Component<{ config: CloudimageProviderConfig }> { }

  interface ImgProps {
    src: string;
    width?: string;
    height?: string;
    params?: Params;
    sizes?: Record<string, any>;
    ratio?: number;
    lazyLoading?: boolean;
    lazyLoadConfig?: Record<string, any>;
    doNotReplaceURL?: boolean;
  }

  class BackgroundImg extends React.Component<ImgProps & React.ComponentProps<'img'>> { }

  export default class Img extends React.Component<ImgProps & React.ComponentProps<'img'>> { }
  
}
