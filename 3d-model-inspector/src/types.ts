export type ShadingMode = 
  | 'shaded' 
  | 'baseColor' 
  | 'roughness' 
  | 'metallic' 
  | 'normal' 
  | 'wireframe' 
  | 'matcap';

export type CameraPreset = 
  | 'perspective' 
  | 'front' 
  | 'side' 
  | 'top' 
  | 'isometric';

export type TextureMapType = 
  | 'baseColor' 
  | 'roughness' 
  | 'metallic' 
  | 'normal' 
  | 'emissive';

export type LightingPreset = 
  | 'studio' 
  | 'sunset' 
  | 'cyber' 
  | 'dawn' 
  | 'interior' 
  | 'dark';

export interface TextureMapInfo {
  type: TextureMapType;
  name: string;
  thumbnailUrl: string;
  resolution: string;
  format: string;
  channels: string;
  description: string;
}

export interface ModelStats {
  topology: string;
  faces: number;
  vertices: number;
  submeshes: number;
  dimensions: {
    x: number;
    y: number;
    z: number;
  };
  fileSize: string;
  textureRes: string;
}

export interface GenerationMetadata {
  id: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  aiEngine: string;
  polyBudget: string;
  symmetry: string;
  style: string;
  seed: number;
  generationTime: string;
  tags: string[];
  author: string;
  date: string;
}

export interface MaterialSettings {
  metalness: number;
  roughness: number;
  normalScale: number;
  wireframe: boolean;
  wireframeColor: string;
  wireframeOpacity: number;
  emissiveColor: string;
  emissiveIntensity: number;
  clearcoat: number;
  transmission: number;
  opacity: number;
}

export interface LightingSettings {
  preset: LightingPreset;
  intensity: number;
  lightColor: string;
  sunElevation: number; // in degrees
  sunAzimuth: number; // in degrees
  shadows: boolean;
  groundGrid: boolean;
  gridColor: string;
  bgColor: string;
  bgMode: 'dark' | 'studio' | 'transparent' | 'gradient';
}

export interface ModelPresetItem {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  generatorKey: string;
  metadata: GenerationMetadata;
}
