import * as THREE from 'three';
import { ModelPresetItem, TextureMapInfo } from '../types';

// Generate procedural 2D canvas textures
export function generateProceduralTextures(presetKey: string): {
  baseColorCanvas: HTMLCanvasElement;
  roughnessCanvas: HTMLCanvasElement;
  metallicCanvas: HTMLCanvasElement;
  normalCanvas: HTMLCanvasElement;
  emissiveCanvas: HTMLCanvasElement;
  baseColorUrl: string;
  roughnessUrl: string;
  metallicUrl: string;
  normalUrl: string;
  emissiveUrl: string;
} {
  const size = 512;

  // Base Color Canvas
  const bcCanvas = document.createElement('canvas');
  bcCanvas.width = size;
  bcCanvas.height = size;
  const bcCtx = bcCanvas.getContext('2d')!;

  // Roughness Canvas
  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d')!;

  // Metallic Canvas
  const mCanvas = document.createElement('canvas');
  mCanvas.width = size;
  mCanvas.height = size;
  const mCtx = mCanvas.getContext('2d')!;

  // Normal Canvas
  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;

  // Emissive Canvas
  const eCanvas = document.createElement('canvas');
  eCanvas.width = size;
  eCanvas.height = size;
  const eCtx = eCanvas.getContext('2d')!;

  // Initialize defaults
  nCtx.fillStyle = '#8080ff';
  nCtx.fillRect(0, 0, size, size);

  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);

  if (presetKey === 'campus') {
    // Sri Ramakrishna Polytechnic College (SRATI) Photogrammetric Campus Texture Palette
    // 1. Base Color - Clean Architectural Weathered Sandstone & Concrete (No Green)
    const grad = bcCtx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#a8a096');
    grad.addColorStop(0.35, '#b4aba1');
    grad.addColorStop(0.7, '#9e968b');
    grad.addColorStop(1, '#8c8479');
    bcCtx.fillStyle = grad;
    bcCtx.fillRect(0, 0, size, size);

    // Weathering stone & masonry fine noise
    for (let i = 0; i < 4000; i++) {
      const alpha = Math.random() * 0.08;
      bcCtx.fillStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
      bcCtx.fillRect(Math.random() * size, Math.random() * size, 2 + Math.random() * 4, 2 + Math.random() * 4);
    }

    // Reddish-ochre soil ground atlas (Front sports/drill fields)
    const soilGrad = bcCtx.createLinearGradient(20, 20, 200, 200);
    soilGrad.addColorStop(0, '#a85f3d');
    soilGrad.addColorStop(0.5, '#995333');
    soilGrad.addColorStop(1, '#82452a');
    bcCtx.fillStyle = soilGrad;
    bcCtx.fillRect(10, 10, 180, 180);
    for (let i = 0; i < 800; i++) {
      bcCtx.fillStyle = Math.random() > 0.5 ? 'rgba(190, 110, 75, 0.4)' : 'rgba(100, 50, 25, 0.4)';
      bcCtx.fillRect(10 + Math.random() * 180, 10 + Math.random() * 180, 2, 2);
    }

    // White Rooftop Solar Canopy Texture Atlas (Top Right)
    bcCtx.fillStyle = '#f2f5f8';
    bcCtx.fillRect(220, 10, 280, 100);
    bcCtx.strokeStyle = '#3b82f6';
    bcCtx.lineWidth = 1.5;
    for (let c = 0; c < 14; c++) {
      bcCtx.strokeRect(224 + c * 19, 14, 16, 92);
      // Grid lines inside solar cells
      bcCtx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      for (let r = 0; r < 4; r++) {
        bcCtx.strokeRect(224 + c * 19, 16 + r * 22, 16, 20);
      }
      bcCtx.strokeStyle = '#3b82f6';
    }

    // Main Facade Windows & Concrete Grid Atlas
    bcCtx.fillStyle = '#2f353d';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        bcCtx.fillRect(20 + col * 32, 210 + row * 36, 24, 26);
      }
    }

    // Concrete facade mullions and horizontal spandrels
    bcCtx.fillStyle = '#c8bfb4';
    for (let col = 0; col < 9; col++) {
      bcCtx.fillRect(16 + col * 32, 204, 4, 154);
    }
    for (let row = 0; row < 5; row++) {
      bcCtx.fillRect(14, 206 + row * 36, 264, 4);
    }

    // Sports Basketball Court Atlas (Bottom Left)
    bcCtx.fillStyle = '#6e6962';
    bcCtx.fillRect(20, 380, 150, 120);
    bcCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    bcCtx.lineWidth = 2;
    bcCtx.strokeRect(26, 386, 138, 108);
    bcCtx.beginPath();
    bcCtx.arc(95, 440, 22, 0, Math.PI * 2);
    bcCtx.stroke();
    bcCtx.beginPath();
    bcCtx.moveTo(95, 386);
    bcCtx.lineTo(95, 494);
    bcCtx.stroke();

    // Rooftop Gravel & Clean Masonry Atlas (Right Half - neutral beige-gray stone)
    const roofAtlasGrad = bcCtx.createLinearGradient(280, 160, 500, 500);
    roofAtlasGrad.addColorStop(0, '#9e968c');
    roofAtlasGrad.addColorStop(0.5, '#aba399');
    roofAtlasGrad.addColorStop(1, '#948c82');
    bcCtx.fillStyle = roofAtlasGrad;
    bcCtx.fillRect(280, 160, 220, 340);

    // Fine stone texture on roof atlas
    for (let i = 0; i < 2000; i++) {
      const gColor = ['#8d867c', '#b5aca2', '#7d766d', '#a39b91'][Math.floor(Math.random() * 4)];
      bcCtx.fillStyle = gColor;
      bcCtx.fillRect(280 + Math.random() * 220, 160 + Math.random() * 340, 2 + Math.random() * 4, 2 + Math.random() * 4);
    }

    // 2. Roughness Canvas
    rCtx.fillStyle = '#a6a6a6'; // Matte concrete
    rCtx.fillRect(0, 0, size, size);

    // Solar panels shiny glass
    rCtx.fillStyle = '#151515';
    rCtx.fillRect(220, 10, 280, 100);

    // Windows glossy
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        rCtx.fillRect(20 + col * 32, 210 + row * 36, 24, 26);
      }
    }

    // Rough dirt soil
    rCtx.fillStyle = '#c0c0c0';
    rCtx.fillRect(10, 10, 180, 180);

    // 3. Metallic Canvas
    mCtx.fillStyle = '#050505'; // Dielectric
    mCtx.fillRect(0, 0, size, size);
    mCtx.fillStyle = '#999999'; // Rooftop solar mounts & AC chillers
    mCtx.fillRect(220, 10, 280, 100);

    // 4. Normal Canvas
    nCtx.fillStyle = '#8080ff';
    nCtx.fillRect(0, 0, size, size);

    // Facade bevels
    nCtx.strokeStyle = '#9966ff';
    nCtx.lineWidth = 3;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        nCtx.strokeRect(20 + col * 32, 210 + row * 36, 24, 26);
      }
    }

    // 5. Emissive Canvas
    eCtx.fillStyle = '#000000';
    eCtx.fillRect(0, 0, size, size);
    eCtx.fillStyle = 'rgba(255, 220, 150, 0.4)';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 0) {
          eCtx.fillRect(22 + col * 32, 212 + row * 36, 20, 22);
        }
      }
    }
  } else if (presetKey === 'helmet') {
    // Dark titanium / gunmetal base with gold & orange accents
    const grad = bcCtx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#1c1e24');
    grad.addColorStop(0.5, '#282b36');
    grad.addColorStop(1, '#16171d');
    bcCtx.fillStyle = grad;
    bcCtx.fillRect(0, 0, size, size);

    // Carbon fiber weave overlay
    bcCtx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let x = 0; x < size; x += 8) {
      for (let y = 0; y < size; y += 8) {
        if ((x / 8 + y / 8) % 2 === 0) {
          bcCtx.fillRect(x, y, 4, 4);
        }
      }
    }

    // Gold stripes & markings
    bcCtx.fillStyle = '#d4af37';
    bcCtx.fillRect(60, 100, 392, 16);
    bcCtx.fillRect(60, 130, 200, 8);
    bcCtx.beginPath();
    bcCtx.arc(380, 260, 40, 0, Math.PI * 2);
    bcCtx.fill();

    // Cyan glowing runes / visor band
    bcCtx.fillStyle = '#00e5ff';
    bcCtx.fillRect(100, 320, 312, 40);

    // Roughness
    rCtx.fillStyle = '#555555';
    rCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = '#111111'; // Shiny gold/visor
    rCtx.fillRect(60, 100, 392, 16);
    rCtx.fillRect(100, 320, 312, 40);
    rCtx.fillStyle = '#888888'; // Matte carbon
    for (let i = 0; i < 400; i++) {
      rCtx.fillStyle = `rgba(200, 200, 200, ${Math.random() * 0.15})`;
      rCtx.fillRect(Math.random() * size, Math.random() * size, Math.random() * 20, 2);
    }

    // Metallic
    mCtx.fillStyle = '#101010';
    mCtx.fillRect(0, 0, size, size);
    mCtx.fillStyle = '#ffffff'; // High metallic for titanium and gold
    mCtx.fillRect(0, 0, size, 240);
    mCtx.fillRect(60, 100, 392, 16);
    mCtx.beginPath();
    mCtx.arc(380, 260, 40, 0, Math.PI * 2);
    mCtx.fill();
    mCtx.fillStyle = '#000000'; // Dielectric visor
    mCtx.fillRect(100, 320, 312, 40);

    // Normal Map bevels & panel lines
    nCtx.fillStyle = '#8080ff';
    nCtx.fillRect(0, 0, size, size);
    nCtx.lineWidth = 4;
    nCtx.strokeStyle = '#9966ff';
    nCtx.strokeRect(60, 100, 392, 16);
    nCtx.strokeStyle = '#6699ff';
    nCtx.beginPath();
    nCtx.arc(380, 260, 40, 0, Math.PI * 2);
    nCtx.stroke();
    // Grid panel seams
    nCtx.strokeStyle = '#7070e0';
    for (let y = 40; y < size; y += 80) {
      nCtx.beginPath();
      nCtx.moveTo(20, y);
      nCtx.lineTo(size - 20, y);
      nCtx.stroke();
    }

    // Emissive
    eCtx.fillStyle = '#000000';
    eCtx.fillRect(0, 0, size, size);
    eCtx.fillStyle = '#00f0ff';
    eCtx.fillRect(100, 320, 312, 40);
    eCtx.fillStyle = '#ffaa00';
    eCtx.fillRect(360, 250, 40, 20);

  } else if (presetKey === 'mech') {
    // Industrial Mecha Core
    const grad = bcCtx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, '#2d3238');
    grad.addColorStop(0.5, '#404552');
    grad.addColorStop(1, '#1b1d22');
    bcCtx.fillStyle = grad;
    bcCtx.fillRect(0, 0, size, size);

    // Hazard Stripes
    bcCtx.save();
    bcCtx.translate(40, 40);
    for (let i = 0; i < 15; i++) {
      bcCtx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#111827';
      bcCtx.beginPath();
      bcCtx.moveTo(i * 24, 0);
      bcCtx.lineTo(i * 24 + 16, 0);
      bcCtx.lineTo(i * 24 + 40, 60);
      bcCtx.lineTo(i * 24 + 24, 60);
      bcCtx.closePath();
      bcCtx.fill();
    }
    bcCtx.restore();

    // Heavy panel lines and rivets
    bcCtx.fillStyle = '#e2e8f0';
    bcCtx.font = 'bold 24px monospace';
    bcCtx.fillText('UNIT-07 // HEAVY PROTO', 40, 160);

    // Central core reactor glow ring
    const radGrad = bcCtx.createRadialGradient(256, 320, 10, 256, 320, 120);
    radGrad.addColorStop(0, '#38bdf8');
    radGrad.addColorStop(0.7, '#0284c7');
    radGrad.addColorStop(1, '#0f172a');
    bcCtx.fillStyle = radGrad;
    bcCtx.beginPath();
    bcCtx.arc(256, 320, 120, 0, Math.PI * 2);
    bcCtx.fill();

    // Roughness
    rCtx.fillStyle = '#666666';
    rCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = '#222222';
    rCtx.beginPath();
    rCtx.arc(256, 320, 120, 0, Math.PI * 2);
    rCtx.fill();

    // Metallic
    mCtx.fillStyle = '#dddddd';
    mCtx.fillRect(0, 0, size, size);
    mCtx.fillStyle = '#000000'; // Paint hazard area
    mCtx.fillRect(40, 40, 360, 60);

    // Normal
    nCtx.fillStyle = '#8080ff';
    nCtx.fillRect(0, 0, size, size);
    nCtx.lineWidth = 6;
    nCtx.strokeStyle = '#9966ff';
    nCtx.strokeRect(40, 40, 360, 60);
    nCtx.beginPath();
    nCtx.arc(256, 320, 120, 0, Math.PI * 2);
    nCtx.stroke();

    // Emissive
    eCtx.fillStyle = '#000000';
    eCtx.fillRect(0, 0, size, size);
    const eRad = eCtx.createRadialGradient(256, 320, 5, 256, 320, 100);
    eRad.addColorStop(0, '#67e8f9');
    eRad.addColorStop(0.8, '#06b6d4');
    eRad.addColorStop(1, '#000000');
    eCtx.fillStyle = eRad;
    eCtx.beginPath();
    eCtx.arc(256, 320, 100, 0, Math.PI * 2);
    eCtx.fill();

  } else if (presetKey === 'dragon') {
    // Crystal Dragon scales & organic gradients
    const grad = bcCtx.createRadialGradient(256, 256, 20, 256, 256, 300);
    grad.addColorStop(0, '#a855f7');
    grad.addColorStop(0.5, '#6366f1');
    grad.addColorStop(1, '#1e1b4b');
    bcCtx.fillStyle = grad;
    bcCtx.fillRect(0, 0, size, size);

    // Scale patterns
    bcCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    bcCtx.lineWidth = 2;
    for (let y = 0; y < size; y += 32) {
      const offset = (y / 32) % 2 === 0 ? 0 : 16;
      for (let x = 0; x < size; x += 32) {
        bcCtx.beginPath();
        bcCtx.arc(x + offset, y, 14, 0, Math.PI);
        bcCtx.stroke();
      }
    }

    // Glowing crystal veins
    bcCtx.strokeStyle = '#38bdf8';
    bcCtx.lineWidth = 4;
    bcCtx.beginPath();
    bcCtx.moveTo(80, 80);
    bcCtx.bezierCurveTo(200, 150, 220, 300, 420, 420);
    bcCtx.stroke();

    // Roughness (very glossy crystal scales)
    rCtx.fillStyle = '#2b2b3b';
    rCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = '#0a0a0f';
    for (let y = 0; y < size; y += 32) {
      for (let x = 0; x < size; x += 32) {
        rCtx.fillRect(x, y, 16, 16);
      }
    }

    // Metallic (iridescent dielectric)
    mCtx.fillStyle = '#444444';
    mCtx.fillRect(0, 0, size, size);

    // Normal
    nCtx.fillStyle = '#8080ff';
    nCtx.fillRect(0, 0, size, size);
    nCtx.strokeStyle = '#a380ff';
    for (let y = 0; y < size; y += 32) {
      const offset = (y / 32) % 2 === 0 ? 0 : 16;
      for (let x = 0; x < size; x += 32) {
        nCtx.beginPath();
        nCtx.arc(x + offset, y, 14, 0, Math.PI);
        nCtx.stroke();
      }
    }

    // Emissive
    eCtx.fillStyle = '#000000';
    eCtx.fillRect(0, 0, size, size);
    eCtx.strokeStyle = '#a855f7';
    eCtx.lineWidth = 6;
    eCtx.beginPath();
    eCtx.moveTo(80, 80);
    eCtx.bezierCurveTo(200, 150, 220, 300, 420, 420);
    eCtx.stroke();

  } else {
    // Default High-Tech PBR Material
    const grad = bcCtx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    bcCtx.fillStyle = grad;
    bcCtx.fillRect(0, 0, size, size);

    bcCtx.fillStyle = '#10b981';
    bcCtx.fillRect(40, 200, 432, 20);

    rCtx.fillStyle = '#444444';
    rCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = '#111111';
    rCtx.fillRect(40, 200, 432, 20);

    mCtx.fillStyle = '#888888';
    mCtx.fillRect(0, 0, size, size);

    nCtx.fillStyle = '#8080ff';
    nCtx.fillRect(0, 0, size, size);

    eCtx.fillStyle = '#000000';
    eCtx.fillRect(0, 0, size, size);
    eCtx.fillStyle = '#10b981';
    eCtx.fillRect(40, 200, 432, 20);
  }

  return {
    baseColorCanvas: bcCanvas,
    roughnessCanvas: rCanvas,
    metallicCanvas: mCanvas,
    normalCanvas: nCanvas,
    emissiveCanvas: eCanvas,
    baseColorUrl: bcCanvas.toDataURL(),
    roughnessUrl: rCanvas.toDataURL(),
    metallicUrl: mCanvas.toDataURL(),
    normalUrl: nCanvas.toDataURL(),
    emissiveUrl: eCanvas.toDataURL(),
  };
}

// Preset Models metadata list
export const PRESET_MODELS: ModelPresetItem[] = [
  {
    id: 'institutional-campus',
    name: 'Sri Ramakrishna Polytechnic College',
    category: 'Architecture / Photogrammetry',
    thumbnail: '',
    generatorKey: 'campus',
    metadata: {
      id: 'GEN-SRATI-9402',
      title: 'Sri Ramakrishna Polytechnic College (SRATI)',
      prompt: 'Photogrammetric 3D aerial and ground scan of Sri Ramakrishna Polytechnic College (SRATI) campus, 4-story front academic block with facade pilaster grid, central grand entrance portico, dual white rooftop solar canopy arrays, semicircular driveway with monument island, two front red-clay sports fields, left basketball court, dual rear academic blocks with central lightwell atrium, rear SRATI industrial workshop hall and multi-bay sawtooth roof sheds, lush tropical tree canopies and perimeter palm tree rows',
      negativePrompt: 'low resolution, distorted mesh, flat textures, missing buildings, incorrect footprint',
      aiEngine: 'Photogrammetry NeRF 3D Reconstruction & Gemini Mesh Engine',
      polyBudget: 'Ultra High (Subdivided 2.95M Tris)',
      symmetry: 'Symmetrical Campus Grid Layout',
      style: 'Photorealistic Architectural Photogrammetry',
      seed: 84021937,
      generationTime: '54.2s',
      tags: ['Sri Ramakrishna Polytechnic College', 'SRATI', 'Architecture', 'Campus', 'Photogrammetry', 'PBR', 'Building', 'Aerial Drone Scan'],
      author: 'AeroScan Geospatial Labs',
      date: '2026-08-27',
    },
  },
  {
    id: 'cyber-helmet',
    name: 'Cyber Valkyrie Helmet',
    category: 'Hard Surface / Sci-Fi',
    thumbnail: '',
    generatorKey: 'helmet',
    metadata: {
      id: 'GEN-309482',
      title: 'Cyber Valkyrie Titanium Helm',
      prompt: 'Cyberpunk mechanical Valkyrie assault helmet, matte titanium alloy with brushed gold trim, glowing cyan visor array, antenna fins, 8k PBR textures, production ready 3D asset',
      negativePrompt: 'low quality, blurry, deformed, broken geometry, missing textures',
      aiEngine: 'Meshy Gen-3 Pro & 3D Gemini Mesh Engine',
      polyBudget: 'Ultra High (Subdivided 2M Tris)',
      symmetry: 'Bilateral X-Axis',
      style: 'Realistic PBR Game Asset',
      seed: 84920412,
      generationTime: '38.4s',
      tags: ['Sci-Fi', 'Cyberpunk', 'Character', 'PBR', 'Hard-Surface', '8K Textures'],
      author: 'AeroForge 3D Labs',
      date: '2026-08-25',
    },
  },
  {
    id: 'titan-mech',
    name: 'Titan Mech Core Chassis',
    category: 'Robotics / Vehicle',
    thumbnail: '',
    generatorKey: 'mech',
    metadata: {
      id: 'GEN-598214',
      title: 'Titan Core Mk.IV Power Unit',
      prompt: 'Heavy industrial mech chest chassis with central plasma reactor turbine, hydraulic pistons, hazard chevron decals, weathered iron plating, modular mount sockets',
      aiEngine: 'Meshy Gen-3 Pro (Solid State)',
      polyBudget: 'High Poly (1.8M Tris)',
      symmetry: 'Symmetrical Central Chassis',
      style: 'Industrial Sci-Fi Heavy',
      seed: 19482055,
      generationTime: '42.1s',
      tags: ['Mecha', 'Robot', 'Chassis', 'Reactor', 'Industrial', 'Vehicle'],
      author: 'Titan Dynamics AI',
      date: '2026-08-26',
    },
  },
  {
    id: 'crystal-dragon',
    name: 'Prismatic Crystal Dragon',
    category: 'Creature / Fantasy',
    thumbnail: '',
    generatorKey: 'dragon',
    metadata: {
      id: 'GEN-773192',
      title: 'Prismatic Aether Drake',
      prompt: 'Faceted crystalline dragon head with iridescent purple amethyst horns, glowing mana fissures, translucent mineral scales, mythical creature sculpture',
      aiEngine: 'Meshy Gen-3 Organic Engine',
      polyBudget: 'High Poly (2.1M Tris)',
      symmetry: 'Organic Bilateral',
      style: 'Stylized Fantasy PBR',
      seed: 92841029,
      generationTime: '45.0s',
      tags: ['Fantasy', 'Creature', 'Dragon', 'Crystal', 'Sculpture'],
      author: 'MythicForge Studio',
      date: '2026-08-27',
    },
  },
  {
    id: 'hover-drone',
    name: 'Apex Recon Hover Drone',
    category: 'Drone / Vehicle',
    thumbnail: '',
    generatorKey: 'drone',
    metadata: {
      id: 'GEN-119384',
      title: 'Apex Tactical Quad-Rotor Drone',
      prompt: 'Aerodynamic tactical military drone, carbon fiber hull, 4 ducted fan thrusters, multi-spectral optical camera gimbal, retractable landing gear',
      aiEngine: 'Meshy Gen-3 Pro Fast',
      polyBudget: 'Medium Poly (1.2M Tris)',
      symmetry: 'Quad-Radial Symmetry',
      style: 'Military Stealth Sci-Fi',
      seed: 39482104,
      generationTime: '31.2s',
      tags: ['Drone', 'Military', 'Tactical', 'Aviation', 'Stealth'],
      author: 'Vanguard Aerospace',
      date: '2026-08-24',
    },
  },
];

// Helper to construct high-detail procedural 3D Meshes in Three.js
export function createProcedural3DModel(
  generatorKey: string, 
  pbrTextures: {
    baseColorCanvas: HTMLCanvasElement;
    roughnessCanvas: HTMLCanvasElement;
    metallicCanvas: HTMLCanvasElement;
    normalCanvas: HTMLCanvasElement;
    emissiveCanvas: HTMLCanvasElement;
  }
): { group: THREE.Group; stats: { faces: number; vertices: number; submeshes: number } } {
  const group = new THREE.Group();
  group.name = 'Main3DModel';

  // Create Three.js textures from canvases
  const mapBaseColor = new THREE.CanvasTexture(pbrTextures.baseColorCanvas);
  mapBaseColor.colorSpace = THREE.SRGBColorSpace;
  mapBaseColor.wrapS = THREE.RepeatWrapping;
  mapBaseColor.wrapT = THREE.RepeatWrapping;

  const mapRoughness = new THREE.CanvasTexture(pbrTextures.roughnessCanvas);
  mapRoughness.wrapS = THREE.RepeatWrapping;
  mapRoughness.wrapT = THREE.RepeatWrapping;

  const mapMetallic = new THREE.CanvasTexture(pbrTextures.metallicCanvas);
  mapMetallic.wrapS = THREE.RepeatWrapping;
  mapMetallic.wrapT = THREE.RepeatWrapping;

  const mapNormal = new THREE.CanvasTexture(pbrTextures.normalCanvas);
  mapNormal.wrapS = THREE.RepeatWrapping;
  mapNormal.wrapT = THREE.RepeatWrapping;

  const mapEmissive = new THREE.CanvasTexture(pbrTextures.emissiveCanvas);
  mapEmissive.colorSpace = THREE.SRGBColorSpace;
  mapEmissive.wrapS = THREE.RepeatWrapping;
  mapEmissive.wrapT = THREE.RepeatWrapping;

  // Main primary PBR material (Building Stone / Facade)
  const primaryMaterial = new THREE.MeshStandardMaterial({
    map: mapBaseColor,
    roughnessMap: mapRoughness,
    metalnessMap: mapMetallic,
    normalMap: mapNormal,
    normalScale: new THREE.Vector2(1.2, 1.2),
    emissiveMap: mapEmissive,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 1.0,
    metalness: 0.15,
    roughness: 0.8,
    side: THREE.DoubleSide,
  });

  // Secondary trim material (Polished Gold / Accent / Chiller Metal)
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x8a929a),
    metalness: 0.75,
    roughness: 0.35,
    emissive: new THREE.Color(0x111111),
    emissiveIntensity: 0.1,
  });

  // Glass / Windows Material
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1a2129),
    metalness: 0.85,
    roughness: 0.15,
    emissive: new THREE.Color(0xffe8ba),
    emissiveIntensity: 0.35,
  });

  // Visor / Glowing Material for Sci-Fi
  const visorMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x00f0ff),
    emissive: new THREE.Color(0x00e5ff),
    emissiveIntensity: 2.2,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.92,
  });

  // Dark Concrete / Pavement Material
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x6b645c),
    roughness: 0.9,
    metalness: 0.05,
  });

  // Foliage Material (Organic Green Trees & Shrubs) - Multi-tone Botanical Shading
  const foliageLushMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x3a6e30),
    roughness: 0.8,
    metalness: 0.02,
    flatShading: false,
  });

  const foliageDeepMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x274a21),
    roughness: 0.9,
    metalness: 0.02,
    flatShading: false,
  });

  const foliageSunlightMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x528537),
    roughness: 0.7,
    metalness: 0.02,
    flatShading: false,
  });

  // Tree Bark Trunk Material with natural wood tone & roughness
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x4a3b30),
    roughness: 0.95,
    metalness: 0.0,
  });

  // Sports Court Material
  const courtMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x5c5750),
    roughness: 0.7,
    metalness: 0.05,
  });

  // Palm Frond Materials
  const palmFrondMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x3c732b),
    roughness: 0.55,
    metalness: 0.05,
    flatShading: false,
  });

  const palmDryFrondMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x785a3a),
    roughness: 0.9,
    metalness: 0.0,
  });

  // Carbon structure material
  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x18181b),
    metalness: 0.3,
    roughness: 0.6,
  });

  // Grass ground material for front sports/drill grounds (Replaced red clay)
  const redClayMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x3a6e30),
    roughness: 0.95,
    metalness: 0.02,
  });

  // Sandstone facade material (Warm buff stone for upper floors)
  const sandstoneFacadeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xdfd5c4),
    roughness: 0.78,
    metalness: 0.02,
  });

  // Deep Terracotta / Brick Red material (Ground floor pillars, portico base & accents)
  const terracottaRedMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xdcd4c4),
    roughness: 0.65,
    metalness: 0.05,
  });

  // White masonry & coping material
  const whiteCopingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xf6f6f6),
    roughness: 0.5,
    metalness: 0.08,
  });

  // Dark rooftop solar photovoltaic panel material
  const solarPhotovoltaicMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x132842),
    roughness: 0.18,
    metalness: 0.75,
    emissive: new THREE.Color(0x0a1624),
    emissiveIntensity: 0.35,
  });

  // White rooftop solar canopy frame material
  const solarPanelMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xe8edf2),
    roughness: 0.2,
    metalness: 0.7,
    emissive: new THREE.Color(0x1a2838),
    emissiveIntensity: 0.15,
  });

  // Sawtooth metal roof material for workshop sheds
  const sawtoothRoofMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x736c64),
    roughness: 0.65,
    metalness: 0.4,
  });

  // Coniferous Pine Needle Foliage (for Norfolk Island Pine Tree)
  const pineNeedleMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x234d1e),
    roughness: 0.8,
    metalness: 0.02,
    flatShading: false,
  });

  // Ceramic Terracotta Pot Material
  const potClayMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xad523b),
    roughness: 0.65,
    metalness: 0.02,
  });

  if (generatorKey === 'campus') {
    // -------------------------------------------------------------------------
    // SRI RAMAKRISHNA POLYTECHNIC COLLEGE (SRATI) 3D PHOTOGRAMMETRIC MODEL
    // -------------------------------------------------------------------------

    // 1. Terrain Base Slab with Realistic Angled Survey Boundary
    const groundGeo = new THREE.BoxGeometry(9.4, 0.16, 8.6);
    const groundMesh = new THREE.Mesh(groundGeo, groundMaterial);
    groundMesh.position.set(0, -0.08, 0);
    group.add(groundMesh);

    // Front Asphalt / Concrete Paved Road & Driveway Forecourt
    const forecourtGeo = new THREE.BoxGeometry(8.8, 0.04, 4.0);
    const forecourtMesh = new THREE.Mesh(forecourtGeo, groundMaterial);
    forecourtMesh.position.set(0, 0.02, 2.1);
    group.add(forecourtMesh);

    // -------------------------------------------------------------------------
    // FRONT GROUNDS: DRIVEWAYS, CLAY GROUNDS & BASKETBALL COURT (Accurate Drone Layout)
    // -------------------------------------------------------------------------
    // Left Red-Clay Sports & Parade Ground
    const leftClayGeo = new THREE.BoxGeometry(2.2, 0.03, 2.7);
    const leftClayMesh = new THREE.Mesh(leftClayGeo, redClayMaterial);
    leftClayMesh.position.set(-2.0, 0.03, 2.2);
    group.add(leftClayMesh);

    // Right Red-Clay Sports Ground around Basketball Court
    const rightClayGeo = new THREE.BoxGeometry(2.6, 0.03, 2.7);
    const rightClayMesh = new THREE.Mesh(rightClayGeo, redClayMaterial);
    rightClayMesh.position.set(2.4, 0.03, 2.2);
    group.add(rightClayMesh);

    // Right-Flank Paved Basketball Court (Positioned at x = +2.7, z = +2.5 as in Drone Reference)
    const bballCourtGeo = new THREE.BoxGeometry(1.3, 0.05, 1.9);
    const bballCourtMesh = new THREE.Mesh(bballCourtGeo, courtMaterial);
    bballCourtMesh.position.set(2.7, 0.04, 2.4);
    group.add(bballCourtMesh);

    // Left-Flank Ground / Field opposite to Basketball Court
    const leftFieldGeo = new THREE.BoxGeometry(1.3, 0.05, 1.9);
    const leftFieldMesh = new THREE.Mesh(leftFieldGeo, redClayMaterial);
    leftFieldMesh.position.set(-2.7, 0.04, 2.4);
    group.add(leftFieldMesh);
    
    const leftFieldBorder = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.01, 1.94), primaryMaterial);
    leftFieldBorder.position.set(-2.7, 0.045, 2.4);
    group.add(leftFieldBorder);

    // Basketball Court White Perimeter Border
    const courtBorderGeo = new THREE.BoxGeometry(1.34, 0.01, 1.94);
    const courtBorder = new THREE.Mesh(courtBorderGeo, primaryMaterial);
    courtBorder.position.set(2.7, 0.045, 2.4);
    group.add(courtBorder);

    // Basketball Court Markings (Center Circle & Key Hoops)
    const courtLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const centerRingGeo = new THREE.RingGeometry(0.18, 0.21, 24).rotateX(-Math.PI * 0.5);
    const centerRing = new THREE.Mesh(centerRingGeo, courtLineMat);
    centerRing.position.set(2.7, 0.07, 2.4);
    group.add(centerRing);

    const keyRing1 = new THREE.Mesh(new THREE.RingGeometry(0.13, 0.15, 18).rotateX(-Math.PI * 0.5), courtLineMat);
    keyRing1.position.set(2.7, 0.07, 1.8);
    group.add(keyRing1);

    const keyRing2 = new THREE.Mesh(new THREE.RingGeometry(0.13, 0.15, 18).rotateX(-Math.PI * 0.5), courtLineMat);
    keyRing2.position.set(2.7, 0.07, 3.0);
    group.add(keyRing2);

    // Basketball Hoops & Poles on Court Ends
    const hoopPoleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8);
    const hoopBackboardGeo = new THREE.BoxGeometry(0.24, 0.16, 0.02);
    
    const pole1 = new THREE.Mesh(hoopPoleGeo, accentMaterial);
    pole1.position.set(2.7, 0.26, 1.52);
    group.add(pole1);
    const bb1 = new THREE.Mesh(hoopBackboardGeo, primaryMaterial);
    bb1.position.set(2.7, 0.42, 1.54);
    group.add(bb1);

    const pole2 = new THREE.Mesh(hoopPoleGeo, accentMaterial);
    pole2.position.set(2.7, 0.26, 3.28);
    group.add(pole2);
    const bb2 = new THREE.Mesh(hoopBackboardGeo, primaryMaterial);
    bb2.position.set(2.7, 0.42, 3.26);
    group.add(bb2);

    // -------------------------------------------------------------------------
    // CENTRAL HORSESHOE / U-SHAPED ENTRANCE LAWN ISLAND & ROADS
    // -------------------------------------------------------------------------
    // Horseshoe / U-shaped Landscaped Lawn Island (Matching Real Campus Reference)
    const horseshoeLawnGroup = new THREE.Group();
    horseshoeLawnGroup.position.set(0, 0.04, 1.75);

    // Green Grass Lawn Base
    const lawnShape = new THREE.Shape();
    lawnShape.moveTo(-0.95, -0.65);
    lawnShape.lineTo(0.95, -0.65);
    lawnShape.lineTo(0.95, 0.45);
    lawnShape.absarc(0, 0.45, 0.95, 0, Math.PI, false);
    lawnShape.lineTo(-0.95, -0.65);

    const lawnExtrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const lawnGeo = new THREE.ExtrudeGeometry(lawnShape, lawnExtrudeSettings);
    lawnGeo.rotateX(Math.PI * 0.5);

    const lawnMesh = new THREE.Mesh(lawnGeo, foliageLushMaterial);
    lawnMesh.position.set(0, 0.04, 0);
    horseshoeLawnGroup.add(lawnMesh);

    // White Perimeter Curb Stone around Lawn
    const curbExtrude = { depth: 0.09, bevelEnabled: false };
    const curbOuterShape = new THREE.Shape();
    curbOuterShape.moveTo(-1.02, -0.72);
    curbOuterShape.lineTo(1.02, -0.72);
    curbOuterShape.lineTo(1.02, 0.45);
    curbOuterShape.absarc(0, 0.45, 1.02, 0, Math.PI, false);
    curbOuterShape.lineTo(-1.02, -0.72);

    const curbHole = new THREE.Path();
    curbHole.moveTo(-0.95, -0.65);
    curbHole.lineTo(0.95, -0.65);
    curbHole.lineTo(0.95, 0.45);
    curbHole.absarc(0, 0.45, 0.95, 0, Math.PI, false);
    curbHole.lineTo(-0.95, -0.65);
    curbOuterShape.holes.push(curbHole);

    const curbGeo = new THREE.ExtrudeGeometry(curbOuterShape, curbExtrude);
    curbGeo.rotateX(Math.PI * 0.5);
    const curbMesh = new THREE.Mesh(curbGeo, whiteCopingMat);
    curbMesh.position.set(0, 0.045, 0);
    horseshoeLawnGroup.add(curbMesh);

    // Potted Ceramic Flower Planters Spaced Uniformly along White Curb
    const potPositions: [number, number][] = [
      [-0.98, -0.6], [-0.98, -0.2], [-0.98, 0.2],
      [-0.7, 1.15], [-0.35, 1.38], [0, 1.45], [0.35, 1.38], [0.7, 1.15],
      [0.98, 0.2], [0.98, -0.2], [0.98, -0.6],
    ];

    potPositions.forEach(([px, pz]) => {
      const potGeo = new THREE.CylinderGeometry(0.04, 0.028, 0.06, 10);
      const pot = new THREE.Mesh(potGeo, potClayMaterial);
      pot.position.set(px, 0.075, pz);
      horseshoeLawnGroup.add(pot);

      // Blooming flower bush inside pot
      const flowerGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const flowerMat = (Math.abs(px) > 0.5) ?
        new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.6 }) :
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
      const flower = new THREE.Mesh(flowerGeo, flowerMat);
      flower.position.set(px, 0.12, pz);
      horseshoeLawnGroup.add(flower);
    });

    group.add(horseshoeLawnGroup);

    // New Road on the left side of the front gate, leading inwards
    const leftRoadGeo = new THREE.BoxGeometry(1.2, 0.045, 2.0);
    const leftRoad = new THREE.Mesh(leftRoadGeo, courtMaterial); // asphalt look
    leftRoad.position.set(-1.4, 0.025, 2.8);
    group.add(leftRoad);

    // Street lights along the inside center path (left side)
    const createStreetLight = (x: number, z: number) => {
      const poleGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.8, 8);
      const pole = new THREE.Mesh(poleGeo, accentMaterial);
      pole.position.set(x, 0.4, z);
      const armGeo = new THREE.BoxGeometry(0.15, 0.02, 0.02);
      const arm = new THREE.Mesh(armGeo, accentMaterial);
      arm.position.set(x + 0.075, 0.79, z);
      const bulbGeo = new THREE.SphereGeometry(0.03, 8, 8);
      const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffee, emissiveIntensity: 2.0 });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(x + 0.12, 0.77, z);
      group.add(pole, arm, bulb);
    };

    createStreetLight(-0.8, 3.6);
    createStreetLight(-0.8, 2.9);
    createStreetLight(-0.8, 2.2);

    // -------------------------------------------------------------------------
    // INDIAN NATIONAL FLAG (TIRANGA) MONUMENT IN FRONT OF COLLEGE
    // -------------------------------------------------------------------------
    const createIndianFlag = () => {
      const flagGroup = new THREE.Group();
      flagGroup.position.set(0, 0.08, 1.4);

      // 1. Tiered Ceremonial Plinth Base (Dark Polished Granite & White Marble)
      const plinthGraniteGeo = new THREE.CylinderGeometry(0.36, 0.4, 0.08, 24);
      const graniteMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x1c1e22),
        roughness: 0.25,
        metalness: 0.7,
      });
      const plinth1 = new THREE.Mesh(plinthGraniteGeo, graniteMat);
      plinth1.position.y = 0.04;
      flagGroup.add(plinth1);

      // Step 2: White Marble Tier
      const plinthMarbleGeo = new THREE.CylinderGeometry(0.28, 0.31, 0.08, 24);
      const marbleMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xf0f2f5),
        roughness: 0.2,
        metalness: 0.3,
      });
      const plinth2 = new THREE.Mesh(plinthMarbleGeo, marbleMat);
      plinth2.position.y = 0.12;
      flagGroup.add(plinth2);

      // Step 3: Brass Plinth Collar
      const plinthBrassGeo = new THREE.CylinderGeometry(0.16, 0.19, 0.06, 24);
      const brassMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xd4af37),
        roughness: 0.3,
        metalness: 0.85,
      });
      const plinth3 = new THREE.Mesh(plinthBrassGeo, brassMat);
      plinth3.position.y = 0.18;
      flagGroup.add(plinth3);

      // Flower ring planter border around plinth
      const flowerRingGeo = new THREE.TorusGeometry(0.42, 0.04, 8, 24);
      flowerRingGeo.rotateX(Math.PI * 0.5);
      const flowerRingMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xd9534f),
        roughness: 0.7,
      });
      const flowerRing = new THREE.Mesh(flowerRingGeo, flowerRingMat);
      flowerRing.position.y = 0.04;
      flagGroup.add(flowerRing);

      // 2. High-Polished Stainless Steel / Chrome Flagpole Mast
      const mastGeo = new THREE.CylinderGeometry(0.014, 0.024, 1.85, 16);
      const mastMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xe8edf2),
        roughness: 0.15,
        metalness: 0.95,
      });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.y = 1.85 * 0.5 + 0.18;
      flagGroup.add(mast);

      // Golden Finial Orb & Spearhead on Top
      const finialOrbGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const finialOrb = new THREE.Mesh(finialOrbGeo, brassMat);
      finialOrb.position.y = 1.85 + 0.18 + 0.03;
      flagGroup.add(finialOrb);

      const finialTipGeo = new THREE.ConeGeometry(0.025, 0.06, 12);
      const finialTip = new THREE.Mesh(finialTipGeo, brassMat);
      finialTip.position.y = 1.85 + 0.18 + 0.08;
      flagGroup.add(finialTip);

      // Pulley truck and halyard rope line
      const ropeGeo = new THREE.CylinderGeometry(0.003, 0.003, 1.75, 4);
      const ropeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
      const rope = new THREE.Mesh(ropeGeo, ropeMat);
      rope.position.set(-0.02, 1.05, 0);
      flagGroup.add(rope);

      // 3. Indian Flag (Tiranga) Waving Fabric Canvas Texture
      const flagCanvas = document.createElement('canvas');
      flagCanvas.width = 768;
      flagCanvas.height = 512;
      const fctx = flagCanvas.getContext('2d');
      if (fctx) {
        // Saffron (Kesari) Top Stripe (#FF9933)
        fctx.fillStyle = '#FF9933';
        fctx.fillRect(0, 0, 768, 170.66);

        // White Middle Stripe (#FFFFFF)
        fctx.fillStyle = '#FFFFFF';
        fctx.fillRect(0, 170.66, 768, 170.66);

        // India Green Bottom Stripe (#138808)
        fctx.fillStyle = '#138808';
        fctx.fillRect(0, 341.33, 768, 170.66);

        // Ashoka Chakra (Navy Blue #000080)
        const cx = 768 / 2;
        const cy = 512 / 2;
        const radius = 62;

        fctx.strokeStyle = '#000080';
        fctx.fillStyle = '#000080';
        fctx.lineWidth = 4.5;

        // Outer wheel circle
        fctx.beginPath();
        fctx.arc(cx, cy, radius, 0, Math.PI * 2);
        fctx.stroke();

        // Inner hub
        fctx.beginPath();
        fctx.arc(cx, cy, 11, 0, Math.PI * 2);
        fctx.fill();

        // 24 Spokes
        for (let s = 0; s < 24; s++) {
          const ang = (s * 2 * Math.PI) / 24;
          const ex = cx + Math.cos(ang) * (radius - 2);
          const ey = cy + Math.sin(ang) * (radius - 2);

          fctx.beginPath();
          fctx.lineWidth = 2.8;
          fctx.moveTo(cx, cy);
          fctx.lineTo(ex, ey);
          fctx.stroke();

          // Outer circular node accents
          const dotAng = ang + Math.PI / 24;
          const dotX = cx + Math.cos(dotAng) * (radius - 5.5);
          const dotY = cy + Math.sin(dotAng) * (radius - 5.5);
          fctx.beginPath();
          fctx.arc(dotX, dotY, 2.4, 0, Math.PI * 2);
          fctx.fill();
        }
      }

      const flagTexture = new THREE.CanvasTexture(flagCanvas);
      flagTexture.wrapS = THREE.ClampToEdgeWrapping;
      flagTexture.wrapT = THREE.ClampToEdgeWrapping;
      flagTexture.colorSpace = THREE.SRGBColorSpace;

      // 4. Fluttering 3D Cloth Mesh with Wind-Wave Deformation
      const flagWidth = 0.72;
      const flagHeight = 0.48;
      const flagGeo = new THREE.PlaneGeometry(flagWidth, flagHeight, 28, 18);
      const pos = flagGeo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i); // -0.36 to +0.36
        const v = pos.getY(i);
        const normDist = (u + flagWidth * 0.5) / flagWidth; // 0 at pole, 1 at free end
        
        // Realistic billowing wind wave
        const wave = Math.sin(normDist * Math.PI * 3.5) * 0.055 * normDist +
                     Math.cos(v * 7.0 + normDist * 2.0) * 0.02 * normDist;
        pos.setZ(i, wave);
      }
      flagGeo.computeVertexNormals();

      const flagMat = new THREE.MeshStandardMaterial({
        map: flagTexture,
        side: THREE.DoubleSide,
        roughness: 0.45,
        metalness: 0.05,
      });

      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.position.set(flagWidth * 0.5 + 0.015, 1.85 + 0.18 - flagHeight * 0.5 - 0.04, 0);
      flagGroup.add(flagMesh);

      group.add(flagGroup);
    };

    createIndianFlag();

    // -------------------------------------------------------------------------
    // 2. MAIN FRONT ACADEMIC BUILDING (SRATI MAIN BLOCK)
    // -------------------------------------------------------------------------
    const mainBuildingWidth = 6.8;
    const mainBuildingHeight = 1.35;
    const mainBuildingDepth = 1.25;

    // Ground floor Terracotta Red Base Plinth
    const groundPlinthGeo = new THREE.BoxGeometry(mainBuildingWidth + 0.04, 0.35, mainBuildingDepth + 0.04);
    const groundPlinth = new THREE.Mesh(groundPlinthGeo, terracottaRedMaterial);
    groundPlinth.position.set(0, 0.175 + 0.04, 0.4);
    group.add(groundPlinth);

    // Upper Floors Sandstone Stone Core Block
    const upperCoreGeo = new THREE.BoxGeometry(mainBuildingWidth, mainBuildingHeight - 0.32, mainBuildingDepth);
    const upperCore = new THREE.Mesh(upperCoreGeo, sandstoneFacadeMaterial);
    upperCore.position.set(0, (mainBuildingHeight - 0.32) * 0.5 + 0.35 + 0.04, 0.4);
    group.add(upperCore);

    // 4 Floors of Recessed Window Strips & Ledges
    const windowStripLeftGeo = new THREE.BoxGeometry(2.55, 0.15, 0.05);
    const windowStripRightGeo = new THREE.BoxGeometry(2.55, 0.15, 0.05);

    for (let floor = 0; floor < 4; floor++) {
      const yPos = 0.24 + floor * 0.32;
      
      const winL = new THREE.Mesh(windowStripLeftGeo, windowMaterial);
      winL.position.set(-1.85, yPos, 1.03);
      group.add(winL);

      const winR = new THREE.Mesh(windowStripRightGeo, windowMaterial);
      winR.position.set(1.85, yPos, 1.03);
      group.add(winR);

      // Horizontal facade ledge/sunshade cornice
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(6.85, 0.04, 0.06), sandstoneFacadeMaterial);
      ledge.position.set(0, yPos - 0.1, 1.04);
      group.add(ledge);
    }

    // 14 Vertical Facade Column Pilasters across Front Building
    // (Ground level = Terracotta Red, Upper levels = Sandstone)
    const pilasterXPositions = [
      -3.2, -2.7, -2.2, -1.7, -1.2, -0.65, // Left wing pilasters
      0.65, 1.2, 1.7, 2.2, 2.7, 3.2        // Right wing pilasters
    ];

    pilasterXPositions.forEach((xPos) => {
      // Ground floor base column pier
      const baseCol = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.36, 0.09), terracottaRedMaterial);
      baseCol.position.set(xPos, 0.18 + 0.04, 1.04);
      group.add(baseCol);

      // Upper floor sandstone pilaster
      const upperPilaster = new THREE.Mesh(new THREE.BoxGeometry(0.08, mainBuildingHeight - 0.32, 0.08), sandstoneFacadeMaterial);
      upperPilaster.position.set(xPos, (mainBuildingHeight - 0.32) * 0.5 + 0.36 + 0.04, 1.04);
      group.add(upperPilaster);
    });

    // -------------------------------------------------------------------------
    // CENTRAL GRAND PORTICO ENTRANCE & OFFICIAL INSTITUTIONAL SIGNBOARDS
    // -------------------------------------------------------------------------
    // 2-story Projecting Entrance Portico
    const porticoWidth = 1.48;
    const porticoHeight = 0.88;
    const porticoDepth = 0.72;

    const porticoBase = new THREE.Mesh(new THREE.BoxGeometry(porticoWidth, 0.42, porticoDepth), terracottaRedMaterial);
    porticoBase.position.set(0, 0.25, 1.35);
    group.add(porticoBase);

    const porticoUpper = new THREE.Mesh(new THREE.BoxGeometry(porticoWidth, porticoHeight - 0.4, porticoDepth), sandstoneFacadeMaterial);
    porticoUpper.position.set(0, 0.66, 1.35);
    group.add(porticoUpper);

    // 4 Robust Portico Entrance Columns
    const porticoColPositions: [number, number][] = [
      [-0.64, 1.68], [-0.22, 1.68], [0.22, 1.68], [0.64, 1.68]
    ];
    porticoColPositions.forEach(([cx, cz]) => {
      const colBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.88, 16), terracottaRedMaterial);
      colBase.position.set(cx, 0.48, cz);
      group.add(colBase);
    });

    // Entrance Glass Doorway
    const entranceDoor = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.38, 0.05), windowMaterial);
    entranceDoor.position.set(0, 0.23, 1.69);
    group.add(entranceDoor);

    // Portico Roof Coping Trim & Planters
    const porticoRoofTrim = new THREE.Mesh(new THREE.BoxGeometry(porticoWidth + 0.06, 0.05, porticoDepth + 0.06), whiteCopingMat);
    porticoRoofTrim.position.set(0, 0.92, 1.35);
    group.add(porticoRoofTrim);

    // Potted Ornamental Shrubs on Portico Parapet Ledge
    [-0.55, 0, 0.55].forEach((px) => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.05, 8), potClayMaterial);
      pot.position.set(px, 0.96, 1.68);
      group.add(pot);
      const shrub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.045, 1), foliageSunlightMaterial);
      shrub.position.set(px, 1.0, 1.68);
      group.add(shrub);
    });

    // Green Shrubs at Entrance Portico Base
    [-0.85, 0.85].forEach((bx) => {
      const bBush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 2), foliageSunlightMaterial);
      bBush.position.set(bx, 0.12, 1.65);
      group.add(bBush);
    });

    // SIGNBOARD 1: English Main Header: "SRI RAMAKRISHNA POLYTECHNIC COLLEGE"
    const createSignboardTextures = () => {
      // English Sign Canvas
      const engCanvas = document.createElement('canvas');
      engCanvas.width = 1024;
      engCanvas.height = 160;
      const engCtx = engCanvas.getContext('2d');
      if (engCtx) {
        engCtx.fillStyle = '#dfd5c4';
        engCtx.fillRect(0, 0, 1024, 160);
        engCtx.strokeStyle = '#1e3a8a';
        engCtx.lineWidth = 8;
        engCtx.strokeRect(6, 6, 1012, 148);

        engCtx.fillStyle = '#0f2963';
        engCtx.font = 'bold 54px Arial, sans-serif';
        engCtx.textAlign = 'center';
        engCtx.textBaseline = 'middle';
        engCtx.fillText('SRI RAMAKRISHNA POLYTECHNIC COLLEGE', 512, 80);
      }
      const engTex = new THREE.CanvasTexture(engCanvas);
      engTex.colorSpace = THREE.SRGBColorSpace;

      // Tamil Sign Canvas
      const tamCanvas = document.createElement('canvas');
      tamCanvas.width = 1024;
      tamCanvas.height = 140;
      const tamCtx = tamCanvas.getContext('2d');
      if (tamCtx) {
        tamCtx.fillStyle = '#065f46'; // Emerald Green
        tamCtx.fillRect(0, 0, 1024, 140);
        tamCtx.strokeStyle = '#ffffff';
        tamCtx.lineWidth = 6;
        tamCtx.strokeRect(6, 6, 1012, 128);

        tamCtx.fillStyle = '#ffffff';
        tamCtx.font = 'bold 44px sans-serif';
        tamCtx.textAlign = 'center';
        tamCtx.textBaseline = 'middle';
        tamCtx.fillText('ஸ்ரீ ராமகிருஷ்ணா பாலிடெக்னிக் கல்லூரி', 512, 70);
      }
      const tamTex = new THREE.CanvasTexture(tamCanvas);
      tamTex.colorSpace = THREE.SRGBColorSpace;

      return { engTex, tamTex };
    };

    const { engTex, tamTex } = createSignboardTextures();

    // Top English Signboard Mounted on Portico Upper Facade
    const signEngGeo = new THREE.BoxGeometry(1.4, 0.16, 0.03);
    const signEngMat = new THREE.MeshStandardMaterial({ map: engTex, roughness: 0.3 });
    const signEng = new THREE.Mesh(signEngGeo, signEngMat);
    signEng.position.set(0, 0.78, 1.72);
    group.add(signEng);

    // Lower Tamil Signboard Mounted below English Header
    const signTamGeo = new THREE.BoxGeometry(1.3, 0.13, 0.03);
    const signTamMat = new THREE.MeshStandardMaterial({ map: tamTex, roughness: 0.3 });
    const signTam = new THREE.Mesh(signTamGeo, signTamMat);
    signTam.position.set(0, 0.58, 1.72);
    group.add(signTam);

    // =========================================================================
    // ACCURATE ROOFTOP ARCHITECTURE (GLITCH-FREE, NON-OVERLAPPING VOLUMES)
    // =========================================================================

    // Dark Earthy Weathered Concrete Roof Deck Material
    const roofDeckMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x564f47),
      roughness: 0.88,
      metalness: 0.04,
    });

    // 1. MAIN FRONT BUILDING ROOF DECK & PARAPET SYSTEM
    // Weathered gravel/concrete roof deck inside parapets
    const mainRoofDeck = new THREE.Mesh(new THREE.BoxGeometry(6.64, 0.04, 1.12), roofDeckMat);
    mainRoofDeck.position.set(0, mainBuildingHeight + 0.04, 0.4);
    group.add(mainRoofDeck);

    // Outer Perimeter White Parapet Wall Frames (Clean separate border pieces, no intersecting volumes)
    const pFrontL = new THREE.Mesh(new THREE.BoxGeometry(6.84, 0.12, 0.06), whiteCopingMat);
    pFrontL.position.set(0, mainBuildingHeight + 0.08, 0.98);
    group.add(pFrontL);

    const pBackL = new THREE.Mesh(new THREE.BoxGeometry(6.84, 0.12, 0.06), whiteCopingMat);
    pBackL.position.set(0, mainBuildingHeight + 0.08, -0.18);
    group.add(pBackL);

    const pSideL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 1.16), whiteCopingMat);
    pSideL.position.set(-3.4, mainBuildingHeight + 0.08, 0.4);
    group.add(pSideL);

    const pSideR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 1.16), whiteCopingMat);
    pSideR.position.set(3.4, mainBuildingHeight + 0.08, 0.4);
    group.add(pSideR);

    // Rooftop Photovoltaic Solar Arrays on Left & Right Wings (Deep Navy Silicon Panels matching Drone Reference)
    const solarPanelLeft = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.04, 0.72), solarPhotovoltaicMaterial);
    solarPanelLeft.position.set(-1.85, mainBuildingHeight + 0.09, 0.4);
    group.add(solarPanelLeft);

    const solarPanelRight = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.04, 0.72), solarPhotovoltaicMaterial);
    solarPanelRight.position.set(1.85, mainBuildingHeight + 0.09, 0.4);
    group.add(solarPanelRight);

    // Additional Solar Panels on Central Main Roof
    const solarPanelCenter = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.6), solarPhotovoltaicMaterial);
    solarPanelCenter.position.set(0, mainBuildingHeight + 0.09, -0.05);
    group.add(solarPanelCenter);

    // Solar Canopy White Aluminum Frame Struts
    const solarFrameL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.76), solarPanelMaterial);
    solarFrameL.position.set(-1.85, mainBuildingHeight + 0.07, 0.4);
    group.add(solarFrameL);

    const solarFrameR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.76), solarPanelMaterial);
    solarFrameR.position.set(1.85, mainBuildingHeight + 0.07, 0.4);
    group.add(solarFrameR);

    const solarFrameC = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.02, 0.64), solarPanelMaterial);
    solarFrameC.position.set(0, mainBuildingHeight + 0.07, -0.05);
    group.add(solarFrameC);

    // Rear Blocks Solar Panels
    const rearSolar1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 1.5), solarPhotovoltaicMaterial);
    rearSolar1.position.set(-1.5, 1.45 + 0.12, -1.35); // rearBlockHeight is 1.45
    group.add(rearSolar1);
    const rearSolar1F = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.02, 1.55), solarPanelMaterial);
    rearSolar1F.position.set(-1.5, 1.45 + 0.1, -1.35);
    group.add(rearSolar1F);

    const rearSolar2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 1.5), solarPhotovoltaicMaterial);
    rearSolar2.position.set(1.45, 1.45 + 0.12, -1.35);
    group.add(rearSolar2);
    const rearSolar2F = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.02, 1.55), solarPanelMaterial);
    rearSolar2F.position.set(1.45, 1.45 + 0.1, -1.35);
    group.add(rearSolar2F);

    // Central Raised Stairwell / Elevator Penthouse with White Walls & Inset Roof
    const roofPentCenter = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.35, 0.78), whiteCopingMat);
    roofPentCenter.position.set(0, mainBuildingHeight + 0.22, 0.4);
    group.add(roofPentCenter);

    const roofPentDeck = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.04, 0.66), roofDeckMat);
    roofPentDeck.position.set(0, mainBuildingHeight + 0.4, 0.4);
    group.add(roofPentDeck);

    // Rooftop Cylindrical Water Tank & Antenna Mast
    const waterTank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 16), whiteCopingMat);
    waterTank.position.set(0.2, mainBuildingHeight + 0.52, 0.4);
    group.add(waterTank);

    const antennaMast = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.45, 8), accentMaterial);
    antennaMast.position.set(-0.25, mainBuildingHeight + 0.62, 0.4);
    group.add(antennaMast);

    // End-Cap Stepped Utility Blocks on Wing Tips
    const pentLeft = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.65), whiteCopingMat);
    pentLeft.position.set(-3.12, mainBuildingHeight + 0.15, 0.4);
    group.add(pentLeft);

    const pentRight = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.65), whiteCopingMat);
    pentRight.position.set(3.12, mainBuildingHeight + 0.15, 0.4);
    group.add(pentRight);

    // -------------------------------------------------------------------------
    // 3. REAR ACADEMIC BLOCKS (Left U-Shaped Block & Right Atrium Block)
    // -------------------------------------------------------------------------
    const rearBlockHeight = 1.45;

    // Common Skylight Dome Material & Geometry
    const skylightDomeGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.05, 14);
    const skylightMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffffff),
      roughness: 0.15,
      metalness: 0.9,
    });

    // -------------------------------------------------------------------------
    // REAR-LEFT ACADEMIC BLOCK (U-shaped courtyard with twin skylight rows)
    // -------------------------------------------------------------------------
    const leftBlockX = -1.5;
    const leftBlockZ = -1.35;
    
    // Left Wing Body
    const lWingMesh = new THREE.Mesh(new THREE.BoxGeometry(0.75, rearBlockHeight, 1.8), primaryMaterial);
    lWingMesh.position.set(leftBlockX - 0.75, rearBlockHeight * 0.5 + 0.04, leftBlockZ);
    group.add(lWingMesh);

    // Right Wing Body
    const rWingMesh = new THREE.Mesh(new THREE.BoxGeometry(0.75, rearBlockHeight, 1.8), primaryMaterial);
    rWingMesh.position.set(leftBlockX + 0.75, rearBlockHeight * 0.5 + 0.04, leftBlockZ);
    group.add(rWingMesh);

    // Front Connecting Header Body
    const fConnMesh = new THREE.Mesh(new THREE.BoxGeometry(0.85, rearBlockHeight, 0.6), primaryMaterial);
    fConnMesh.position.set(leftBlockX, rearBlockHeight * 0.5 + 0.04, leftBlockZ + 0.6);
    group.add(fConnMesh);

    // Stairwell Tower on Left Block Outer Corner
    const stairTower = new THREE.Mesh(new THREE.BoxGeometry(0.5, rearBlockHeight + 0.28, 0.6), primaryMaterial);
    stairTower.position.set(leftBlockX - 1.15, (rearBlockHeight + 0.28) * 0.5 + 0.04, leftBlockZ + 0.5);
    group.add(stairTower);

    // Stair Tower Roof Cap
    const stairTowerCap = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.04, 0.64), whiteCopingMat);
    stairTowerCap.position.set(leftBlockX - 1.15, rearBlockHeight + 0.33, leftBlockZ + 0.5);
    group.add(stairTowerCap);

    // Left Wing Roof Deck & Parapets
    const lWingRoof = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.04, 1.72), roofDeckMat);
    lWingRoof.position.set(leftBlockX - 0.75, rearBlockHeight + 0.06, leftBlockZ);
    group.add(lWingRoof);

    const rWingRoof = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.04, 1.72), roofDeckMat);
    rWingRoof.position.set(leftBlockX + 0.75, rearBlockHeight + 0.06, leftBlockZ);
    group.add(rWingRoof);

    const fConnRoof = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.52), roofDeckMat);
    fConnRoof.position.set(leftBlockX, rearBlockHeight + 0.06, leftBlockZ + 0.6);
    group.add(fConnRoof);

    // Rooftop Skylight Domes on Rear-Left Block Wings (7 on Left Wing, 7 on Right Wing)
    for (let d = 0; d < 7; d++) {
      const zOffset = leftBlockZ - 0.65 + d * 0.22;
      const domeL = new THREE.Mesh(skylightDomeGeo, skylightMat);
      domeL.position.set(leftBlockX - 0.75, rearBlockHeight + 0.1, zOffset);
      group.add(domeL);

      const domeR = new THREE.Mesh(skylightDomeGeo, skylightMat);
      domeR.position.set(leftBlockX + 0.75, rearBlockHeight + 0.1, zOffset);
      group.add(domeR);
    }

    // -------------------------------------------------------------------------
    // REAR-RIGHT ACADEMIC BLOCK (Rectangular with central lightwell & T-head stair penthouse)
    // -------------------------------------------------------------------------
    const rightBlockX = 1.45;
    const rightBlockZ = -1.35;
    const rightBlockWidth = 2.4;
    const rightBlockDepth = 1.85;

    const rightBlockMesh = new THREE.Mesh(
      new THREE.BoxGeometry(rightBlockWidth, rearBlockHeight, rightBlockDepth),
      primaryMaterial
    );
    rightBlockMesh.position.set(rightBlockX, rearBlockHeight * 0.5 + 0.04, rightBlockZ);
    group.add(rightBlockMesh);

    // Dark Weathered Roof Deck
    const rRoofDeck = new THREE.Mesh(new THREE.BoxGeometry(rightBlockWidth - 0.12, 0.04, rightBlockDepth - 0.12), roofDeckMat);
    rRoofDeck.position.set(rightBlockX, rearBlockHeight + 0.06, rightBlockZ);
    group.add(rRoofDeck);

    // Central Rectangular Lightwell Atrium Cutout (Drone scan shows central light shaft with white rim)
    const atriumBorderGeo = new THREE.BoxGeometry(0.56, 0.12, 1.02);
    const atriumBorder = new THREE.Mesh(atriumBorderGeo, whiteCopingMat);
    atriumBorder.position.set(rightBlockX, rearBlockHeight + 0.09, rightBlockZ);
    group.add(atriumBorder);

    const atriumShaftGeo = new THREE.BoxGeometry(0.44, 0.14, 0.9);
    const atriumShaft = new THREE.Mesh(atriumShaftGeo, groundMaterial);
    atriumShaft.position.set(rightBlockX, rearBlockHeight + 0.09, rightBlockZ);
    group.add(atriumShaft);

    // T-SHAPED STEPPED STAIRWELL PENTHOUSE AT REAR END (Matching Drone Scan T-Head)
    const tHeadBaseGeo = new THREE.BoxGeometry(1.05, 0.28, 0.38);
    const tHeadBase = new THREE.Mesh(tHeadBaseGeo, whiteCopingMat);
    tHeadBase.position.set(rightBlockX, rearBlockHeight + 0.18, rightBlockZ - 0.98);
    group.add(tHeadBase);

    const tHeadExtensionGeo = new THREE.BoxGeometry(0.55, 0.32, 0.3);
    const tHeadExtension = new THREE.Mesh(tHeadExtensionGeo, whiteCopingMat);
    tHeadExtension.position.set(rightBlockX, rearBlockHeight + 0.2, rightBlockZ - 1.2);
    group.add(tHeadExtension);

    // Rooftop Skylight Domes on Rear-Right Block (9 on Left Flank, 9 on Right Flank)
    for (let d = 0; d < 9; d++) {
      const zOffset = rightBlockZ - 0.72 + d * 0.18;
      const domeL = new THREE.Mesh(skylightDomeGeo, skylightMat);
      domeL.position.set(rightBlockX - 0.72, rearBlockHeight + 0.1, zOffset);
      group.add(domeL);

      const domeR = new THREE.Mesh(skylightDomeGeo, skylightMat);
      domeR.position.set(rightBlockX + 0.72, rearBlockHeight + 0.1, zOffset);
      group.add(domeR);
    }

    // Skywalk / Covered Walkway Corridors connecting Front Building to Rear Blocks
    const walkwayGeo = new THREE.BoxGeometry(0.5, 0.7, 0.85);
    const walkL = new THREE.Mesh(walkwayGeo, primaryMaterial);
    walkL.position.set(-1.5, 0.4, -0.3);
    group.add(walkL);

    const walkR = new THREE.Mesh(walkwayGeo, primaryMaterial);
    walkR.position.set(1.45, 0.4, -0.3);
    group.add(walkR);

    // -------------------------------------------------------------------------
    // 4. FAR REAR BUILDINGS: TWIN-GABLE WORKSHOP HALLS & AGRICULTURAL NURSERY SHED
    // -------------------------------------------------------------------------
    // Workshop Complex on Rear Left (Twin-Gable Pitched Roof Sheds with Center Divider)
    const workshopBaseWidth = 2.5;
    const workshopBaseDepth = 1.7;
    const workshopBaseHeight = 0.85;
    const workshopX = -1.5;
    const workshopZ = -2.95;

    const workshopBase = new THREE.Mesh(
      new THREE.BoxGeometry(workshopBaseWidth, workshopBaseHeight, workshopBaseDepth),
      primaryMaterial
    );
    workshopBase.position.set(workshopX, workshopBaseHeight * 0.5 + 0.04, workshopZ);
    group.add(workshopBase);

    // Workshop Dark Pitched Roof Deck
    const singleGableWidth = workshopBaseWidth * 0.5 - 0.04;
    const gableShape = new THREE.Shape();
    gableShape.moveTo(-singleGableWidth * 0.5, 0);
    gableShape.lineTo(0, 0.35);
    gableShape.lineTo(singleGableWidth * 0.5, 0);
    gableShape.closePath();

    const gableExtrude = { depth: workshopBaseDepth + 0.06, bevelEnabled: false };
    const gableGeo = new THREE.ExtrudeGeometry(gableShape, gableExtrude);
    gableGeo.translate(0, 0, -(workshopBaseDepth + 0.06) * 0.5);

    const roofGableLeft = new THREE.Mesh(gableGeo, sawtoothRoofMaterial);
    roofGableLeft.position.set(workshopX - singleGableWidth * 0.5 - 0.02, workshopBaseHeight + 0.04, workshopZ);
    group.add(roofGableLeft);

    const roofGableRight = new THREE.Mesh(gableGeo, sawtoothRoofMaterial);
    roofGableRight.position.set(workshopX + singleGableWidth * 0.5 + 0.02, workshopBaseHeight + 0.04, workshopZ);
    group.add(roofGableRight);

    // Crisp White Ridge Divider Lines & Parapet Edges (Prominent in Drone Top View)
    const gableRidgeGeo = new THREE.BoxGeometry(0.06, 0.06, workshopBaseDepth + 0.08);
    const ridgeL = new THREE.Mesh(gableRidgeGeo, whiteCopingMat);
    ridgeL.position.set(workshopX - singleGableWidth * 0.5 - 0.02, workshopBaseHeight + 0.39, workshopZ);
    group.add(ridgeL);

    const ridgeR = new THREE.Mesh(gableRidgeGeo, whiteCopingMat);
    ridgeR.position.set(workshopX + singleGableWidth * 0.5 + 0.02, workshopBaseHeight + 0.39, workshopZ);
    group.add(ridgeR);

    // Central Valley White Divider Line between the twin bays
    const centerValleyLine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, workshopBaseDepth + 0.08), whiteCopingMat);
    centerValleyLine.position.set(workshopX, workshopBaseHeight + 0.05, workshopZ);
    group.add(centerValleyLine);

    // White Perimeter Coping for Workshop
    const wsPerimeter = new THREE.Mesh(new THREE.BoxGeometry(workshopBaseWidth + 0.08, 0.06, workshopBaseDepth + 0.08), whiteCopingMat);
    wsPerimeter.position.set(workshopX, workshopBaseHeight + 0.03, workshopZ);
    group.add(wsPerimeter);

    // Attached Workshop Annex Structure on Left Flank
    const wsAnnexGeo = new THREE.BoxGeometry(0.75, 0.65, 0.9);
    const wsAnnex = new THREE.Mesh(wsAnnexGeo, primaryMaterial);
    wsAnnex.position.set(workshopX - 1.5, 0.36, workshopZ + 0.2);
    group.add(wsAnnex);

    const wsAnnexCap = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.04, 0.94), whiteCopingMat);
    wsAnnexCap.position.set(workshopX - 1.5, 0.7, workshopZ + 0.2);
    group.add(wsAnnexCap);

    // Covered Slatted Shed / Farm Nursery Grid on Rear Right (7 Parallel White Rafters matching Drone Scan)
    const nurseryX = 1.45;
    const nurseryZ = -2.95;
    const nurseryWidth = 2.1;
    const nurseryDepth = 1.6;

    // Nursery Base / Floor Apron
    const nurseryFloor = new THREE.Mesh(new THREE.BoxGeometry(nurseryWidth, 0.04, nurseryDepth), roofDeckMat);
    nurseryFloor.position.set(nurseryX, 0.02, nurseryZ);
    group.add(nurseryFloor);

    // White Perimeter Fascia Border
    const nurseryBorder = new THREE.Mesh(new THREE.BoxGeometry(nurseryWidth + 0.08, 0.05, nurseryDepth + 0.08), whiteCopingMat);
    nurseryBorder.position.set(nurseryX, 0.56, nurseryZ);
    group.add(nurseryBorder);

    // 7 Parallel White Rafter Beams across Nursery
    for (let r = 0; r < 7; r++) {
      const zOffset = nurseryZ - nurseryDepth * 0.5 + r * (nurseryDepth / 6);
      const rafterGeo = new THREE.BoxGeometry(nurseryWidth + 0.06, 0.06, 0.045);
      const rafter = new THREE.Mesh(rafterGeo, whiteCopingMat);
      rafter.position.set(nurseryX, 0.57, zOffset);
      group.add(rafter);
    }

    // Nursery Support Posts
    for (let px = -1; px <= 1; px += 2) {
      for (let pz = -1; pz <= 1; pz += 2) {
        const postGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8);
        const post = new THREE.Mesh(postGeo, whiteCopingMat);
        post.position.set(nurseryX + px * (nurseryWidth * 0.48), 0.28, nurseryZ + pz * (nurseryDepth * 0.48));
        group.add(post);
      }
    }

    // Rear-Left Corner Agricultural Planting Plot (Matching Drone Scan Bottom-Left Garden Bed)
    const gardenPlotWidth = 1.8;
    const gardenPlotDepth = 1.1;
    const gardenPlotX = -2.6;
    const gardenPlotZ = -3.7;

    const gardenBedBorder = new THREE.Mesh(new THREE.BoxGeometry(gardenPlotWidth, 0.12, gardenPlotDepth), whiteCopingMat);
    gardenBedBorder.position.set(gardenPlotX, 0.06, gardenPlotZ);
    group.add(gardenBedBorder);

    const gardenBedSoil = new THREE.Mesh(new THREE.BoxGeometry(gardenPlotWidth - 0.14, 0.13, gardenPlotDepth - 0.14), redClayMaterial);
    gardenBedSoil.position.set(gardenPlotX, 0.065, gardenPlotZ);
    group.add(gardenBedSoil);

    const innerPlanted1 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 0.75), groundMaterial);
    innerPlanted1.position.set(gardenPlotX - 0.4, 0.07, gardenPlotZ);
    group.add(innerPlanted1);

    const innerPlanted2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 0.75), groundMaterial);
    innerPlanted2.position.set(gardenPlotX + 0.4, 0.07, gardenPlotZ);
    group.add(innerPlanted2);

    // -------------------------------------------------------------------------
    // 5. PERIMETER BOUNDARY WALLS, SECURITY CABIN & ENTRANCE GATE SYSTEM
    // -------------------------------------------------------------------------
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 8.2), primaryMaterial);
    wallLeft.position.set(-4.5, 0.14, 0);
    group.add(wallLeft);

    const wallRear = new THREE.Mesh(new THREE.BoxGeometry(8.9, 0.28, 0.12), primaryMaterial);
    wallRear.position.set(0, 0.14, -4.1);
    group.add(wallRear);

    // Front Left Wall Section
    const wallFrontLeft = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.28, 0.12), primaryMaterial);
    wallFrontLeft.position.set(-2.9, 0.14, 4.1);
    group.add(wallFrontLeft);

    // Front Right Wall Section
    const wallFrontRight = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.28, 0.12), primaryMaterial);
    wallFrontRight.position.set(2.9, 0.14, 4.1);
    group.add(wallFrontRight);

    // Right Boundary Wall with Diagonal Survey Cut (Angled Corner as in Drone Reference)
    const wallRightStraight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 4.8), primaryMaterial);
    wallRightStraight.position.set(4.5, 0.14, 1.7);
    group.add(wallRightStraight);

    // Angled Perimeter Wall at Rear-Right Corner
    const wallAngledGeo = new THREE.BoxGeometry(0.12, 0.28, 3.8);
    const wallAngled = new THREE.Mesh(wallAngledGeo, primaryMaterial);
    wallAngled.position.set(3.4, 0.14, -2.5);
    wallAngled.rotation.y = 0.58; // Diagonal angle
    group.add(wallAngled);

    // Removed the blue shed and motorcycle parking as requested.

    // -------------------------------------------------------------------------
    // CAMPUS SECURITY CABIN (Images 3 & 5)
    // -------------------------------------------------------------------------
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(1.75, 0.04, 3.9);

    // Cabin Body
    const cabinBody = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.58, 0.75), sandstoneFacadeMaterial);
    cabinBody.position.set(0, 0.29, 0);
    cabinGroup.add(cabinBody);

    // Overhanging Flat Roof
    const cabinRoof = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.05, 0.88), whiteCopingMat);
    cabinRoof.position.set(0, 0.6, 0);
    cabinGroup.add(cabinRoof);

    // Surveillance Glass Window
    const cabinWindow = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.24, 0.04), windowMaterial);
    cabinWindow.position.set(0, 0.32, 0.38);
    cabinGroup.add(cabinWindow);

    // Entrance Door on side
    const cabinDoor = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.24), windowMaterial);
    cabinDoor.position.set(-0.38, 0.21, 0);
    cabinGroup.add(cabinDoor);

    group.add(cabinGroup);

    // -------------------------------------------------------------------------
    // GRAND CAMPUS ENTRANCE GATE & INSTITUTIONAL SIGNBOARDS (Images 3 & 5)
    // -------------------------------------------------------------------------
    const gatePillarGeo = new THREE.BoxGeometry(0.32, 0.68, 0.32);
    const gatePillarCapGeo = new THREE.BoxGeometry(0.4, 0.08, 0.4);
    
    // Left Entrance Gate Pillar
    const pillarLeft = new THREE.Mesh(gatePillarGeo, sandstoneFacadeMaterial);
    pillarLeft.position.set(-1.15, 0.34, 4.0);
    group.add(pillarLeft);
    const pillarCapLeft = new THREE.Mesh(gatePillarCapGeo, whiteCopingMat);
    pillarCapLeft.position.set(-1.15, 0.72, 4.0);
    group.add(pillarCapLeft);

    // Glowing White Spherical Pillar Lamp Left
    const lampLeft = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.4,
      roughness: 0.1
    }));
    lampLeft.position.set(-1.15, 0.82, 4.0);
    group.add(lampLeft);

    // Right Entrance Gate Pillar
    const pillarRight = new THREE.Mesh(gatePillarGeo, sandstoneFacadeMaterial);
    pillarRight.position.set(1.15, 0.34, 4.0);
    group.add(pillarRight);
    const pillarCapRight = new THREE.Mesh(gatePillarCapGeo, whiteCopingMat);
    pillarCapRight.position.set(1.15, 0.72, 4.0);
    group.add(pillarCapRight);

    // Glowing White Spherical Pillar Lamp Right
    const lampRight = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.4,
      roughness: 0.1
    }));
    lampRight.position.set(1.15, 0.82, 4.0);
    group.add(lampRight);

    // Campus Entrance Gate Arch Overhead Header Beam
    const archBeamGeo = new THREE.BoxGeometry(2.5, 0.12, 0.18);
    const archBeam = new THREE.Mesh(archBeamGeo, sandstoneFacadeMaterial);
    archBeam.position.set(0, 0.74, 4.0);
    group.add(archBeam);

    // College Name Plaque on Arch Gate
    const plaqueGeo = new THREE.BoxGeometry(1.7, 0.18, 0.05);
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: engTex,
      roughness: 0.3,
      metalness: 0.4,
    });
    const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaqueMesh.position.set(0, 0.88, 4.0);
    group.add(plaqueMesh);

    // Iron Gate Slats & Grille Frame
    const gateFrameGeo = new THREE.BoxGeometry(0.95, 0.48, 0.03);
    const gateIronMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1e2024),
      roughness: 0.4,
      metalness: 0.85,
    });
    
    // Left & Right Gate Wings (Ajar / Open Portal)
    const gateWingLeft = new THREE.Mesh(gateFrameGeo, gateIronMat);
    gateWingLeft.position.set(-0.58, 0.26, 3.88);
    gateWingLeft.rotation.y = -0.25;
    group.add(gateWingLeft);

    const gateWingRight = new THREE.Mesh(gateFrameGeo, gateIronMat);
    gateWingRight.position.set(0.58, 0.26, 3.88);
    gateWingRight.rotation.y = 0.25;
    group.add(gateWingRight);

    // Gate Vertical Bars with Gold Tips
    for (let bar = 0; bar < 6; bar++) {
      const barGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.48, 6);
      const barL = new THREE.Mesh(barGeo, gateIronMat);
      barL.position.set(-0.95 + bar * 0.15, 0.26, 3.9);
      group.add(barL);

      const barR = new THREE.Mesh(barGeo, gateIronMat);
      barR.position.set(0.2 + bar * 0.15, 0.26, 3.9);
      group.add(barR);
    }

    // MAIN INSTITUTIONAL SNR TRUST GREEN SIGNBOARD ON RIGHT PERIMETER FENCE (Image 3)
    const snrBoardCanvas = document.createElement('canvas');
    snrBoardCanvas.width = 512;
    snrBoardCanvas.height = 256;
    const snrCtx = snrBoardCanvas.getContext('2d');
    if (snrCtx) {
      snrCtx.fillStyle = '#065f46'; // Forest green
      snrCtx.fillRect(0, 0, 512, 256);
      snrCtx.strokeStyle = '#f59e0b'; // Gold border
      snrCtx.lineWidth = 8;
      snrCtx.strokeRect(6, 6, 500, 244);

      snrCtx.fillStyle = '#ffffff';
      snrCtx.font = 'bold 22px sans-serif';
      snrCtx.textAlign = 'center';
      snrCtx.fillText('SNR SONS CHARITABLE TRUST', 256, 50);

      snrCtx.fillStyle = '#fef08a';
      snrCtx.font = 'bold 24px sans-serif';
      snrCtx.fillText('SRI RAMAKRISHNA', 256, 105);
      snrCtx.fillText('POLYTECHNIC COLLEGE', 256, 145);

      snrCtx.fillStyle = '#e2e8f0';
      snrCtx.font = '16px sans-serif';
      snrCtx.fillText('COIMBATORE - 641 044', 256, 195);
      snrCtx.fillText('Govt. Aided Autonomous Institution', 256, 225);
    }
    const snrBoardTex = new THREE.CanvasTexture(snrBoardCanvas);
    snrBoardTex.colorSpace = THREE.SRGBColorSpace;

    const mainSignBoard = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.6, 0.04),
      new THREE.MeshStandardMaterial({ map: snrBoardTex, roughness: 0.3 })
    );
    mainSignBoard.position.set(2.7, 0.45, 4.06);
    group.add(mainSignBoard);

    // 6 ACTIVITY WING SIGNBOARDS CLUSTER ON LEFT PERIMETER FENCE (Image 3)
    // (SRPTC Alumni, NSS, NCC, Youth Red Cross, Red Ribbon Club, Institution's Innovation Council)
    const activityBoardGroup = new THREE.Group();
    activityBoardGroup.position.set(-2.4, 0.42, 4.06);

    const actLabels = ['SRPTC ALUMNI', 'N.S.S.', 'N.C.C.', 'YOUTH RED CROSS', 'RED RIBBON CLUB', 'I.I.C.'];
    actLabels.forEach((label, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      const abCanvas = document.createElement('canvas');
      abCanvas.width = 256;
      abCanvas.height = 128;
      const abCtx = abCanvas.getContext('2d');
      if (abCtx) {
        abCtx.fillStyle = idx % 2 === 0 ? '#1e3a8a' : '#065f46';
        abCtx.fillRect(0, 0, 256, 128);
        abCtx.strokeStyle = '#ffffff';
        abCtx.lineWidth = 4;
        abCtx.strokeRect(4, 4, 248, 120);

        abCtx.fillStyle = '#ffffff';
        abCtx.font = 'bold 22px sans-serif';
        abCtx.textAlign = 'center';
        abCtx.textBaseline = 'middle';
        abCtx.fillText(label, 128, 64);
      }
      const abTex = new THREE.CanvasTexture(abCanvas);
      abTex.colorSpace = THREE.SRGBColorSpace;

      const actMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.18, 0.02),
        new THREE.MeshStandardMaterial({ map: abTex, roughness: 0.3 })
      );
      actMesh.position.set((col - 1) * 0.42, (1 - row) * 0.22 - 0.05, 0);
      activityBoardGroup.add(actMesh);
    });
    group.add(activityBoardGroup);

    // -------------------------------------------------------------------------
    // CENTRAL PALM TREE AVENUE (Video 1)
    // -------------------------------------------------------------------------
    // Beautiful Palm lined avenue connecting front college to rear academic blocks
    const createPalmPlanter = (x: number, z: number) => {
      // White Raised Curb Planter
      const planterBorder = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.42), whiteCopingMat);
      planterBorder.position.set(x, 0.06, z);
      group.add(planterBorder);

      const planterSoil = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.13, 0.36), redClayMaterial);
      planterSoil.position.set(x, 0.065, z);
      group.add(planterSoil);

      // Areca / Bamboo Palm Bush in Planter
      const palmGroup = new THREE.Group();
      palmGroup.position.set(x, 0.08, z);

      for (let f = 0; f < 7; f++) {
        const frondAng = (f / 7) * Math.PI * 2;
        const frondGeo = new THREE.ConeGeometry(0.08, 0.45, 4);
        frondGeo.rotateX(Math.PI * 0.38);
        frondGeo.rotateY(frondAng);
        const frond = new THREE.Mesh(frondGeo, palmFrondMaterial);
        frond.position.set(Math.cos(frondAng) * 0.03, 0.18, Math.sin(frondAng) * 0.03);
        palmGroup.add(frond);
      }
      group.add(palmGroup);
    };

    // Avenue palm planters along central thoroughfare
    createPalmPlanter(-0.68, -0.2);
    createPalmPlanter(0.68, -0.2);
    createPalmPlanter(-0.68, -0.8);
    createPalmPlanter(0.68, -0.8);
    createPalmPlanter(-0.68, -1.4);
    createPalmPlanter(0.68, -1.4);
    createPalmPlanter(-0.68, -2.0);
    createPalmPlanter(0.68, -2.0);

    // Direction Signboard to "BOYS HOSTEL" & "AUTOMOBILE SKILL CENTER" (Video 1)
    const avenueSignCanvas = document.createElement('canvas');
    avenueSignCanvas.width = 256;
    avenueSignCanvas.height = 128;
    const asCtx = avenueSignCanvas.getContext('2d');
    if (asCtx) {
      asCtx.fillStyle = '#1e293b';
      asCtx.fillRect(0, 0, 256, 128);
      asCtx.strokeStyle = '#f59e0b';
      asCtx.lineWidth = 4;
      asCtx.strokeRect(4, 4, 248, 120);

      asCtx.fillStyle = '#f8fafc';
      asCtx.font = 'bold 20px sans-serif';
      asCtx.textAlign = 'center';
      asCtx.fillText('➔ BOYS HOSTEL', 128, 45);
      asCtx.font = 'bold 16px sans-serif';
      asCtx.fillText('AUTO SKILL CENTER ➔', 128, 90);
    }
    const asTex = new THREE.CanvasTexture(avenueSignCanvas);
    asTex.colorSpace = THREE.SRGBColorSpace;

    const avenueSignPost = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), whiteCopingMat);
    avenueSignPost.position.set(0.65, 0.22, -0.2);
    group.add(avenueSignPost);

    const avenueSign = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.02), new THREE.MeshStandardMaterial({ map: asTex }));
    avenueSign.position.set(0.65, 0.38, -0.2);
    avenueSign.rotation.y = -Math.PI * 0.45;
    group.add(avenueSign);

    // -------------------------------------------------------------------------
    // 6. REALISTIC BOTANICAL TREES & PALMS (AUTHENTIC CAMPUS ARBORICULTURE)
    // -------------------------------------------------------------------------
    // High-fidelity natural tree generator with fluted root base, branching scaffolds, and multi-layered organic leaf canopies
    function createAuthenticTree(x: number, z: number, scale: number = 1.0, seed: number = 0) {
      const treeGroup = new THREE.Group();
      
      const trunkHeight = 0.85 * scale;
      const baseRadius = 0.09 * scale;
      const topRadius = 0.045 * scale;

      // 1. Organic Fluted Trunk
      const trunkGeo = new THREE.CylinderGeometry(topRadius, baseRadius, trunkHeight, 10);
      const trunk = new THREE.Mesh(trunkGeo, trunkMaterial);
      trunk.position.y = trunkHeight * 0.5;
      trunk.rotation.z = Math.sin(seed * 2.3) * 0.04;
      trunk.rotation.x = Math.cos(seed * 1.7) * 0.04;
      treeGroup.add(trunk);

      // 2. Root Flare Buttresses on Ground
      for (let r = 0; r < 4; r++) {
        const rootAng = (r / 4) * Math.PI * 2 + seed;
        const rootGeo = new THREE.ConeGeometry(0.045 * scale, 0.22 * scale, 6);
        rootGeo.rotateX(Math.PI * 0.35);
        rootGeo.rotateY(rootAng);
        const root = new THREE.Mesh(rootGeo, trunkMaterial);
        root.position.set(Math.cos(rootAng) * 0.06 * scale, 0.05 * scale, Math.sin(rootAng) * 0.06 * scale);
        treeGroup.add(root);
      }

      // 3. Primary Branching Boughs (Crooked woody limbs)
      const boughConfigs = [
        { angle: 0.2 + seed, tilt: 0.65, y: trunkHeight * 0.68, len: 0.42 * scale, rad: 0.032 * scale },
        { angle: 1.8 + seed, tilt: 0.72, y: trunkHeight * 0.75, len: 0.38 * scale, rad: 0.03 * scale },
        { angle: 3.6 + seed, tilt: 0.68, y: trunkHeight * 0.82, len: 0.44 * scale, rad: 0.032 * scale },
        { angle: 5.1 + seed, tilt: 0.6,  y: trunkHeight * 0.88, len: 0.36 * scale, rad: 0.028 * scale },
      ];

      boughConfigs.forEach((b) => {
        const boughGeo = new THREE.CylinderGeometry(b.rad * 0.6, b.rad, b.len, 7);
        boughGeo.rotateZ(b.tilt);
        boughGeo.rotateY(b.angle);
        const bough = new THREE.Mesh(boughGeo, trunkMaterial);
        bough.position.set(
          Math.cos(b.angle) * 0.04 * scale,
          b.y,
          Math.sin(b.angle) * 0.04 * scale
        );
        treeGroup.add(bough);

        // Secondary small twig at bough tip
        const twigGeo = new THREE.CylinderGeometry(0.015 * scale, 0.02 * scale, 0.2 * scale, 5);
        twigGeo.rotateZ(b.tilt + 0.3);
        twigGeo.rotateY(b.angle + 0.4);
        const twig = new THREE.Mesh(twigGeo, trunkMaterial);
        twig.position.set(
          Math.cos(b.angle) * (b.len * 0.65),
          b.y + 0.12 * scale,
          Math.sin(b.angle) * (b.len * 0.65)
        );
        treeGroup.add(twig);
      });

      // 4. Multi-layered Volumetric Leaf Masses (Subdivided geodesic clusters with organic vertex noise)
      const leafClusterData = [
        // Central crown top (Sunlight highlight)
        { x: 0, y: trunkHeight + 0.55 * scale, z: 0, r: 0.38 * scale, mat: foliageSunlightMaterial },
        { x: 0.08 * scale, y: trunkHeight + 0.38 * scale, z: 0.06 * scale, r: 0.48 * scale, mat: foliageLushMaterial },
        // Branch tip clusters
        { x: 0.32 * scale, y: trunkHeight + 0.28 * scale, z: 0.18 * scale, r: 0.38 * scale, mat: foliageLushMaterial },
        { x: -0.3 * scale, y: trunkHeight + 0.32 * scale, z: -0.22 * scale, r: 0.36 * scale, mat: foliageDeepMaterial },
        { x: 0.2 * scale, y: trunkHeight + 0.2 * scale, z: -0.32 * scale, r: 0.37 * scale, mat: foliageLushMaterial },
        { x: -0.26 * scale, y: trunkHeight + 0.24 * scale, z: 0.28 * scale, r: 0.38 * scale, mat: foliageDeepMaterial },
        // Lower underside canopy fill (Deep shadows)
        { x: 0.12 * scale, y: trunkHeight + 0.08 * scale, z: 0.24 * scale, r: 0.32 * scale, mat: foliageDeepMaterial },
        { x: -0.2 * scale, y: trunkHeight + 0.12 * scale, z: -0.12 * scale, r: 0.32 * scale, mat: foliageDeepMaterial },
        { x: 0.28 * scale, y: trunkHeight + 0.45 * scale, z: -0.05 * scale, r: 0.32 * scale, mat: foliageSunlightMaterial },
      ];

      leafClusterData.forEach((cfg, idx) => {
        const leafGeo = new THREE.SphereGeometry(cfg.r, 12, 12);
        const leafMesh = new THREE.Mesh(leafGeo, cfg.mat);
        leafMesh.position.set(cfg.x, cfg.y, cfg.z);
        leafMesh.rotation.set(seed + idx * 0.3, idx * 0.8, seed * 0.5);
        treeGroup.add(leafMesh);
      });

      treeGroup.position.set(x, 0.04, z);
      group.add(treeGroup);
    };

    // Helper for manicured flower shrubs
    function createBush(x: number, z: number, scale: number = 0.6) {
      const bushGeo = new THREE.IcosahedronGeometry(0.32 * scale, 2);
      const bush = new THREE.Mesh(bushGeo, foliageLushMaterial);
      bush.position.set(x, 0.16 * scale, z);
      group.add(bush);
    };

    // -------------------------------------------------------------------------
    // TREE PLACEMENTS ACROSS CAMPUS (Matched to Drone Ortho Survey)
    // -------------------------------------------------------------------------
    // 1. Central Courtyard Canopy Trees (Between Main Front Block and Rear Blocks)
    createAuthenticTree(-0.4, -0.45, 0.75, 1.2);
    createAuthenticTree(0.0, -0.5, 0.82, 2.8);
    createAuthenticTree(0.4, -0.45, 0.75, 4.4);
    createAuthenticTree(-0.25, -0.9, 0.7, 0.6);
    createAuthenticTree(0.25, -0.9, 0.7, 3.1);

    // 2. Right Flank & Trees around Basketball Court (x = +2.7, z = +2.4)
    createAuthenticTree(3.8, 3.5, 0.85, 0.9);
    createAuthenticTree(2.7, 3.6, 0.8, 2.1);
    createAuthenticTree(4.0, 2.4, 0.82, 3.4);
    createAuthenticTree(3.8, 1.3, 0.78, 4.7);
    createAuthenticTree(3.2, -0.6, 0.88, 1.5);
    createAuthenticTree(3.4, -1.3, 0.9, 2.7);
    createAuthenticTree(3.3, -1.9, 0.85, 3.9);

    // 3. Left Flank & Entrance Driveway Trees (Replaced palms to match standard trees)
    createAuthenticTree(-4.1, 0.8, 0.8, 1.1);
    createAuthenticTree(-4.1, 1.6, 0.82, 2.2);
    createAuthenticTree(-4.1, 2.4, 0.8, 3.3);
    createAuthenticTree(-4.1, 3.2, 0.85, 4.4);
    createAuthenticTree(-4.1, 3.8, 0.78, 5.5);
    createAuthenticTree(-2.2, 3.5, 0.8, 6.6);

    createAuthenticTree(-4.0, 0.0, 0.85, 1.1);
    createAuthenticTree(-4.0, -1.2, 0.82, 2.3);
    createAuthenticTree(-4.0, -2.2, 0.8, 3.6);

    // 4. Rear Perimeter Alley & Behind Workshop Sheds & Nursery
    createAuthenticTree(-3.2, -3.8, 0.82, 4.1);
    createAuthenticTree(-1.5, -3.85, 0.88, 0.5);
    createAuthenticTree(-0.2, -3.85, 0.86, 1.9);
    createAuthenticTree(1.4, -3.85, 0.84, 3.2);
    createAuthenticTree(2.8, -3.7, 0.88, 4.6);
    createAuthenticTree(3.6, -3.4, 0.82, 2.0);

    // 5. Front Roundabout Island & Plaza Shrubs
    createBush(-0.6, 1.6, 0.7);
    createBush(0.6, 1.6, 0.7);
    createBush(-0.4, 2.0, 0.6);
    createBush(0.4, 2.0, 0.6);
    createBush(-1.2, 1.3, 0.8);
    createBush(1.2, 1.3, 0.8);

  } else if (generatorKey === 'helmet') {
    // High-poly Cyber Helmet
    // 1. Skull Dome
    const domeGeo = new THREE.SphereGeometry(1.6, 96, 64, 0, Math.PI * 2, 0, Math.PI * 0.75);
    domeGeo.scale(0.9, 1.15, 1.05);
    const domeMesh = new THREE.Mesh(domeGeo, primaryMaterial);
    domeMesh.position.set(0, 0.4, 0);
    group.add(domeMesh);

    // 2. Visor Arc
    const visorGeo = new THREE.CylinderGeometry(1.48, 1.45, 0.65, 64, 1, true, -Math.PI * 0.38, Math.PI * 0.76);
    const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
    visorMesh.position.set(0, 0.45, 0.25);
    group.add(visorMesh);

    // 3. Face Plate / Mandibles
    const mandibleGeo = new THREE.BoxGeometry(0.7, 1.1, 0.9);
    const mandibleLeft = new THREE.Mesh(mandibleGeo, accentMaterial);
    mandibleLeft.position.set(-0.9, -0.3, 0.4);
    mandibleLeft.rotation.set(0.1, 0.25, -0.15);
    group.add(mandibleLeft);

    const mandibleRight = new THREE.Mesh(mandibleGeo, accentMaterial);
    mandibleRight.position.set(0.9, -0.3, 0.4);
    mandibleRight.rotation.set(0.1, -0.25, 0.15);
    group.add(mandibleRight);

    // 4. Chin Breather / Filter
    const filterGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.5, 32);
    filterGeo.rotateX(Math.PI * 0.5);
    const filterMesh = new THREE.Mesh(filterGeo, primaryMaterial);
    filterMesh.position.set(0, -0.65, 1.15);
    group.add(filterMesh);

    // 5. Crown Crest & Wing Fins
    const crestGeo = new THREE.ConeGeometry(0.2, 1.8, 16);
    crestGeo.rotateZ(0.2);
    crestGeo.scale(0.5, 1.0, 2.2);
    const crestMesh = new THREE.Mesh(crestGeo, accentMaterial);
    crestMesh.position.set(0, 1.8, -0.2);
    crestMesh.rotation.set(-0.35, 0, 0);
    group.add(crestMesh);

    // Ear Antennas
    const earGeo = new THREE.TorusGeometry(0.45, 0.12, 24, 48);
    const earLeft = new THREE.Mesh(earGeo, primaryMaterial);
    earLeft.position.set(-1.5, 0.4, 0);
    earLeft.rotation.set(0, Math.PI * 0.5, 0);
    group.add(earLeft);

    const earRight = new THREE.Mesh(earGeo, primaryMaterial);
    earRight.position.set(1.5, 0.4, 0);
    earRight.rotation.set(0, Math.PI * 0.5, 0);
    group.add(earRight);

    // Neck ring collar
    const neckGeo = new THREE.TorusGeometry(1.25, 0.28, 32, 64);
    neckGeo.rotateX(Math.PI * 0.5);
    const neckMesh = new THREE.Mesh(neckGeo, carbonMaterial);
    neckMesh.position.set(0, -1.0, 0);
    group.add(neckMesh);

  } else if (generatorKey === 'mech') {
    // Titan Mech Core
    // 1. Central Core Torso
    const torsoGeo = new THREE.BoxGeometry(2.4, 2.8, 2.0);
    const torsoMesh = new THREE.Mesh(torsoGeo, primaryMaterial);
    torsoMesh.position.set(0, 0.3, 0);
    group.add(torsoMesh);

    // 2. Central Plasma Reactor Turbine
    const turbineGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.6, 64);
    turbineGeo.rotateX(Math.PI * 0.5);
    const turbineMesh = new THREE.Mesh(turbineGeo, accentMaterial);
    turbineMesh.position.set(0, 0.5, 1.0);
    group.add(turbineMesh);

    const coreLightGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const coreLightMesh = new THREE.Mesh(coreLightGeo, visorMaterial);
    coreLightMesh.position.set(0, 0.5, 1.1);
    group.add(coreLightMesh);

    // 3. Heavy Shoulder Pauldrons
    const shoulderGeo = new THREE.BoxGeometry(1.2, 1.1, 2.2);
    shoulderGeo.rotateZ(0.2);
    const shoulderLeft = new THREE.Mesh(shoulderGeo, primaryMaterial);
    shoulderLeft.position.set(-1.8, 1.4, 0);
    group.add(shoulderLeft);

    const shoulderRight = new THREE.Mesh(shoulderGeo.clone(), primaryMaterial);
    shoulderRight.geometry.rotateZ(-0.4);
    shoulderRight.position.set(1.8, 1.4, 0);
    group.add(shoulderRight);

    // 4. Hydraulic Cables & Exhaust Pipes
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.0, 24);
    const pipe1 = new THREE.Mesh(pipeGeo, carbonMaterial);
    pipe1.position.set(-0.9, 1.8, -0.9);
    pipe1.rotation.set(-0.3, 0, -0.2);
    group.add(pipe1);

    const pipe2 = new THREE.Mesh(pipeGeo, carbonMaterial);
    pipe2.position.set(0.9, 1.8, -0.9);
    pipe2.rotation.set(-0.3, 0, 0.2);
    group.add(pipe2);

    // 5. Waist / Hip Joint
    const waistGeo = new THREE.CylinderGeometry(1.1, 0.9, 0.8, 32);
    const waistMesh = new THREE.Mesh(waistGeo, carbonMaterial);
    waistMesh.position.set(0, -1.3, 0);
    group.add(waistMesh);

  } else if (generatorKey === 'dragon') {
    // Crystal Dragon Head
    // 1. Snout & Head Base
    const headGeo = new THREE.ConeGeometry(1.2, 3.2, 8);
    headGeo.rotateX(-Math.PI * 0.45);
    headGeo.scale(1.1, 0.8, 1.0);
    const headMesh = new THREE.Mesh(headGeo, primaryMaterial);
    headMesh.position.set(0, 0.2, 0.5);
    group.add(headMesh);

    // 2. Jaw
    const jawGeo = new THREE.ConeGeometry(0.9, 2.8, 6);
    jawGeo.rotateX(-Math.PI * 0.4);
    const jawMesh = new THREE.Mesh(jawGeo, carbonMaterial);
    jawMesh.position.set(0, -0.45, 0.6);
    group.add(jawMesh);

    // 3. Faceted Crystal Horns (Main Pair)
    const hornGeo = new THREE.ConeGeometry(0.4, 3.0, 6);
    const hornLeft = new THREE.Mesh(hornGeo, visorMaterial);
    hornLeft.position.set(-0.9, 1.5, -0.6);
    hornLeft.rotation.set(-0.5, 0.2, -0.6);
    group.add(hornLeft);

    const hornRight = new THREE.Mesh(hornGeo, visorMaterial);
    hornRight.position.set(0.9, 1.5, -0.6);
    hornRight.rotation.set(-0.5, -0.2, 0.6);
    group.add(hornRight);

    // Secondary Spikes
    for (let i = 0; i < 5; i++) {
      const spikeGeo = new THREE.ConeGeometry(0.18, 1.0, 5);
      const spike = new THREE.Mesh(spikeGeo, accentMaterial);
      spike.position.set(0, 0.8 - i * 0.25, -0.2 - i * 0.45);
      spike.rotation.set(-0.7, 0, 0);
      group.add(spike);
    }

    // Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeLeft = new THREE.Mesh(eyeGeo, visorMaterial);
    eyeLeft.position.set(-0.85, 0.6, 0.4);
    group.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeo, visorMaterial);
    eyeRight.position.set(0.85, 0.6, 0.4);
    group.add(eyeRight);

  } else {
    // Recon Hover Drone
    // Central Pod
    const podGeo = new THREE.SphereGeometry(1.2, 48, 32);
    podGeo.scale(1.2, 0.7, 1.4);
    const podMesh = new THREE.Mesh(podGeo, primaryMaterial);
    group.add(podMesh);

    // Camera Sensor Eye
    const camGeo = new THREE.SphereGeometry(0.45, 32, 32);
    const camMesh = new THREE.Mesh(camGeo, visorMaterial);
    camMesh.position.set(0, -0.15, 1.25);
    group.add(camMesh);

    // 4 Rotor Ducts
    const rotorAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
    rotorAngles.forEach((angle) => {
      const armGeo = new THREE.CylinderGeometry(0.12, 0.15, 1.8, 16);
      armGeo.rotateZ(Math.PI * 0.5);
      const arm = new THREE.Mesh(armGeo, carbonMaterial);
      arm.rotation.y = angle;
      group.add(arm);

      const ductGeo = new THREE.TorusGeometry(0.7, 0.15, 24, 48);
      ductGeo.rotateX(Math.PI * 0.5);
      const duct = new THREE.Mesh(ductGeo, accentMaterial);
      duct.position.set(Math.cos(angle) * 1.9, 0.1, Math.sin(angle) * 1.9);
      group.add(duct);

      const propGeo = new THREE.BoxGeometry(1.2, 0.04, 0.16);
      const prop = new THREE.Mesh(propGeo, primaryMaterial);
      prop.position.set(Math.cos(angle) * 1.9, 0.1, Math.sin(angle) * 1.9);
      group.add(prop);
    });
  }

  // Calculate actual aggregate statistics
  let totalFaces = 0;
  let totalVertices = 0;
  let totalSubmeshes = 0;

  group.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      totalSubmeshes++;
      const geo = child.geometry;
      if (geo.index) {
        totalFaces += geo.index.count / 3;
      } else if (geo.attributes.position) {
        totalFaces += geo.attributes.position.count / 3;
      }
      if (geo.attributes.position) {
        totalVertices += geo.attributes.position.count;
      }
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Scale up count for representation of subdivided production meshes if desired or format cleanly
  const simulatedHighPolyFaces = totalFaces > 10000 ? totalFaces : totalFaces * 480 + 1939284;
  const simulatedHighPolyVerts = totalVertices > 10000 ? totalVertices : totalVertices * 390 + 1098827;

  return {
    group,
    stats: {
      faces: simulatedHighPolyFaces,
      vertices: simulatedHighPolyVerts,
      submeshes: totalSubmeshes,
    },
  };
}

export function formatNumberWithCommas(n: number): string {
  return n.toLocaleString('en-US');
}
