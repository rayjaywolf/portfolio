import { MeshImageMaterial, MeshBannerMaterial } from '../webgl/materials';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshImageMaterial: any;
      meshBannerMaterial: any;
    }
  }
}

export {}; 