import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import type { 
  ShadingMode, 
  CameraPreset, 
  MaterialSettings, 
  LightingSettings, 
  ModelStats 
} from './types';
import { createProcedural3DModel } from './proceduralAssets';

interface ThreeCanvasProps {
  generatorKey: string;
  pbrCanvases: {
    baseColorCanvas: HTMLCanvasElement;
    roughnessCanvas: HTMLCanvasElement;
    metallicCanvas: HTMLCanvasElement;
    normalCanvas: HTMLCanvasElement;
    emissiveCanvas: HTMLCanvasElement;
  };
  shadingMode: ShadingMode;
  cameraPreset: CameraPreset;
  materialSettings: MaterialSettings;
  lightingSettings: LightingSettings;
  autoRotate: boolean;
  onStatsCalculated?: (stats: ModelStats) => void;
  screenshotTrigger?: number;
  exportGLBTrigger?: number;
  exportOBJTrigger?: number;
  customModelGroup?: THREE.Group | null;
  onBuildingPositionsUpdate?: (positions: Record<string, { x: number; y: number; visible: boolean }>) => void;
  isHeatmapActive?: boolean;
}

export const WORLD_BUILDING_ANCHORS: Record<string, THREE.Vector3> = {
  'block-a': new THREE.Vector3(-1.6, 0.9, -1.1),
  'block-b': new THREE.Vector3(-1.6, 0.9, 1.1),
  'block-c': new THREE.Vector3(1.6, 0.9, -1.1),
  'block-d': new THREE.Vector3(1.6, 0.9, 1.1),
};

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  generatorKey,
  pbrCanvases,
  shadingMode,
  cameraPreset,
  materialSettings,
  lightingSettings,
  autoRotate,
  onStatsCalculated,
  screenshotTrigger = 0,
  exportGLBTrigger = 0,
  exportOBJTrigger = 0,
  customModelGroup,
  onBuildingPositionsUpdate,
  isHeatmapActive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const wireframeGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const shadowPlaneRef = useRef<THREE.Mesh | null>(null);

  // Lights refs
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Cache base materials for fast mode-switching
  const originalMaterialsMap = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());

  // Initialize Three.js Scene, Camera, Renderer, Controls
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 4.4);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const canvas = renderer.domElement;
    canvas.setAttribute('data-engine', 'three.js r170');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    containerRef.current.replaceChildren(canvas);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.2;
    controls.maxDistance = 18;
    controls.minPolarAngle = 0.04;
    controls.maxPolarAngle = Math.PI * 0.94;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Ground Plane & Shadows
    const shadowGeo = new THREE.PlaneGeometry(24, 24);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI * 0.5;
    shadowPlane.position.y = -1.8;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    shadowPlaneRef.current = shadowPlane;

    // Ground Grid Helper
    const grid = new THREE.GridHelper(16, 24, 0x3b82f6, 0x272738);
    grid.position.y = -1.79;
    scene.add(grid);
    gridHelperRef.current = grid;

    // Animation loop
    let animationFrameId: number;
    const projVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);

        // Project 3D building positions to 2D screen coordinates
        if (onBuildingPositionsUpdate && containerRef.current) {
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          const posMap: Record<string, { x: number; y: number; visible: boolean }> = {};

          for (const [id, anchor] of Object.entries(WORLD_BUILDING_ANCHORS)) {
            projVec.copy(anchor);
            if (modelGroupRef.current) {
              projVec.applyMatrix4(modelGroupRef.current.matrixWorld);
            }
            projVec.project(cameraRef.current);

            const isVisible = projVec.z < 1.0;
            const x = (projVec.x * 0.5 + 0.5) * width;
            const y = (-(projVec.y * 0.5) + 0.5) * height;

            posMap[id] = { x, y, visible: isVisible };
          }
          onBuildingPositionsUpdate(posMap);
        }
      }
    };
    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update Model Geometry & Materials when generatorKey / custom model changes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove previous model if exists
    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
      modelGroupRef.current = null;
    }
    if (wireframeGroupRef.current) {
      sceneRef.current.remove(wireframeGroupRef.current);
      wireframeGroupRef.current = null;
    }
    originalMaterialsMap.current.clear();

    let newGroup: THREE.Group;
    let stats: { faces: number; vertices: number; submeshes: number };

    if (customModelGroup) {
      newGroup = customModelGroup;
      // Calculate custom model stats
      let f = 0, v = 0, m = 0;
      newGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          m++;
          const geo = child.geometry;
          f += geo.index ? geo.index.count / 3 : geo.attributes.position ? geo.attributes.position.count / 3 : 0;
          v += geo.attributes.position ? geo.attributes.position.count : 0;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      stats = { faces: Math.round(f), vertices: Math.round(v), submeshes: m };
    } else {
      const generated = createProcedural3DModel(generatorKey, pbrCanvases);
      newGroup = generated.group;
      stats = generated.stats;
    }

    // Center and scale model neatly in the viewport
    const bbox = new THREE.Box3().setFromObject(newGroup);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    newGroup.position.sub(center); // center around origin
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 2.4 / maxDim;
      newGroup.scale.set(scale, scale, scale);
    }

    // Save original materials
    newGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        originalMaterialsMap.current.set(child, child.material);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    sceneRef.current.add(newGroup);
    modelGroupRef.current = newGroup;

    // Report stats if callback provided
    if (onStatsCalculated) {
      onStatsCalculated({
        topology: 'Triangle',
        faces: stats.faces,
        vertices: stats.vertices,
        submeshes: stats.submeshes,
        dimensions: {
          x: parseFloat(size.x.toFixed(2)),
          y: parseFloat(size.y.toFixed(2)),
          z: parseFloat(size.z.toFixed(2)),
        },
        fileSize: '18.4 MB',
        textureRes: '2048 × 2048',
      });
    }
  }, [generatorKey, customModelGroup, pbrCanvases, onStatsCalculated]);

  // Apply Shading Mode
  useEffect(() => {
    if (!modelGroupRef.current) return;

    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const originalMat = originalMaterialsMap.current.get(child);

        if (shadingMode === 'shaded') {
          // Restore original PBR material
          if (originalMat) {
            child.material = originalMat;
          }
        } else if (shadingMode === 'baseColor') {
          // Unlit Base Color
          const bcTex = new THREE.CanvasTexture(pbrCanvases.baseColorCanvas);
          bcTex.colorSpace = THREE.SRGBColorSpace;
          child.material = new THREE.MeshBasicMaterial({ map: bcTex });
        } else if (shadingMode === 'roughness') {
          // Roughness preview
          const rTex = new THREE.CanvasTexture(pbrCanvases.roughnessCanvas);
          child.material = new THREE.MeshBasicMaterial({ map: rTex });
        } else if (shadingMode === 'metallic') {
          // Metallic preview
          const mTex = new THREE.CanvasTexture(pbrCanvases.metallicCanvas);
          child.material = new THREE.MeshBasicMaterial({ map: mTex });
        } else if (shadingMode === 'normal') {
          // Normal vector shader
          child.material = new THREE.MeshNormalMaterial({ wireframe: false });
        } else if (shadingMode === 'wireframe') {
          // Clean Wireframe
          child.material = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            wireframe: true,
          });
        } else if (shadingMode === 'matcap') {
          child.material = new THREE.MeshMatcapMaterial({ color: 0xcccccc });
        }
      }
    });
  }, [shadingMode, pbrCanvases]);

  // Apply 3D Building Heatmap Recoloring Shader Mode
  useEffect(() => {
    if (!modelGroupRef.current) return;

    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const originalMat = originalMaterialsMap.current.get(child);

        if (isHeatmapActive && shadingMode === 'shaded') {
          // Calculate mesh position in model space
          const pos = child.position;
          let heatColor = 0x3f7a5b;
          let emissiveColor = 0x113311;
          let intensity = 0.5;

          // Section into 4 primary blocks (Block A, B, C, D)
          if (pos.x >= 0 && pos.z < 0) {
            // Block C - Hotspot (#1 Reported Faults) -> Crimson Red
            heatColor = 0xff0044;
            emissiveColor = 0xff0033;
            intensity = 1.6;
          } else if (pos.x < 0 && pos.z < 0) {
            // Block A - High Priority -> Deep Amber
            heatColor = 0xff9100;
            emissiveColor = 0xff6d00;
            intensity = 1.2;
          } else if (pos.x < 0 && pos.z >= 0) {
            // Block B - Medium Priority -> Neon Cyan
            heatColor = 0x00e5ff;
            emissiveColor = 0x00b0ff;
            intensity = 0.9;
          } else {
            // Block D - Clear -> Emerald Green
            heatColor = 0x00e676;
            emissiveColor = 0x00c853;
            intensity = 0.7;
          }

          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(heatColor),
            emissive: new THREE.Color(emissiveColor),
            emissiveIntensity: intensity,
            roughness: 0.3,
            metalness: 0.6,
          });
        } else if (shadingMode === 'shaded') {
          if (originalMat) {
            child.material = originalMat;
          }
        }
      }
    });
  }, [isHeatmapActive, shadingMode]);

  // Apply Material adjustments (Sliders)
  useEffect(() => {
    if (!modelGroupRef.current || shadingMode !== 'shaded') return;

    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.metalness = materialSettings.metalness;
        child.material.roughness = materialSettings.roughness;
        if (child.material.normalScale) {
          child.material.normalScale.set(materialSettings.normalScale, materialSettings.normalScale);
        }
        child.material.emissiveIntensity = materialSettings.emissiveIntensity;
      }
    });

    // Handle wireframe overlay
    if (sceneRef.current && modelGroupRef.current) {
      if (materialSettings.wireframe) {
        if (!wireframeGroupRef.current) {
          const wireGroup = new THREE.Group();
          wireGroup.name = 'WireframeOverlay';
          modelGroupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const wireMesh = new THREE.Mesh(
                child.geometry.clone(),
                new THREE.MeshBasicMaterial({
                  color: new THREE.Color(materialSettings.wireframeColor),
                  wireframe: true,
                  transparent: true,
                  opacity: materialSettings.wireframeOpacity,
                  depthTest: true,
                })
              );
              wireMesh.position.copy(child.position);
              wireMesh.rotation.copy(child.rotation);
              wireMesh.scale.copy(child.scale);
              wireGroup.add(wireMesh);
            }
          });
          wireGroup.position.copy(modelGroupRef.current.position);
          wireGroup.rotation.copy(modelGroupRef.current.rotation);
          wireGroup.scale.copy(modelGroupRef.current.scale);
          sceneRef.current.add(wireGroup);
          wireframeGroupRef.current = wireGroup;
        } else {
          wireframeGroupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
              child.material.color.set(materialSettings.wireframeColor);
              child.material.opacity = materialSettings.wireframeOpacity;
            }
          });
        }
      } else if (wireframeGroupRef.current) {
        sceneRef.current.remove(wireframeGroupRef.current);
        wireframeGroupRef.current = null;
      }
    }
  }, [materialSettings, shadingMode]);

  // Apply Lighting Preset and Settings
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !rimLightRef.current || !ambientLightRef.current) return;

    const { preset, intensity, sunAzimuth, groundGrid, shadows, bgMode } = lightingSettings;

    // Sun Azimuth rotation
    const rad = (sunAzimuth * Math.PI) / 180;
    keyLightRef.current.position.set(Math.cos(rad) * 6, 5, Math.sin(rad) * 6);

    // Apply Presets
    if (preset === 'sunset') {
      keyLightRef.current.color.set(0xff9933);
      fillLightRef.current.color.set(0x993366);
      rimLightRef.current.color.set(0xffcc66);
      ambientLightRef.current.color.set(0x402030);
    } else if (preset === 'cyber') {
      keyLightRef.current.color.set(0x00ffff);
      fillLightRef.current.color.set(0xff00aa);
      rimLightRef.current.color.set(0x38bdf8);
      ambientLightRef.current.color.set(0x110022);
    } else if (preset === 'dawn') {
      keyLightRef.current.color.set(0xffeedd);
      fillLightRef.current.color.set(0x88bbff);
      rimLightRef.current.color.set(0xffffff);
      ambientLightRef.current.color.set(0x334466);
    } else if (preset === 'interior') {
      keyLightRef.current.color.set(0xffe6cc);
      fillLightRef.current.color.set(0xcc9966);
      rimLightRef.current.color.set(0xffffff);
      ambientLightRef.current.color.set(0x332211);
    } else if (preset === 'dark') {
      keyLightRef.current.color.set(0xffffff);
      fillLightRef.current.color.set(0x222233);
      rimLightRef.current.color.set(0x445566);
      ambientLightRef.current.color.set(0x0a0a0f);
    } else {
      // Studio
      keyLightRef.current.color.set(0xffffff);
      fillLightRef.current.color.set(0x93c5fd);
      rimLightRef.current.color.set(0x38bdf8);
      ambientLightRef.current.color.set(0xffffff);
    }

    keyLightRef.current.intensity = 2.4 * intensity;
    fillLightRef.current.intensity = 1.2 * intensity;
    rimLightRef.current.intensity = 1.8 * intensity;
    ambientLightRef.current.intensity = 0.5 * intensity;

    if (gridHelperRef.current) {
      gridHelperRef.current.visible = groundGrid;
    }
    if (shadowPlaneRef.current) {
      shadowPlaneRef.current.visible = shadows;
    }

    // Viewport background color
    if (sceneRef.current) {
      if (bgMode === 'studio') {
        sceneRef.current.background = new THREE.Color(0x181822);
      } else if (bgMode === 'dark') {
        sceneRef.current.background = new THREE.Color(0x0e0e12);
      } else {
        sceneRef.current.background = null; // Transparent
      }
    }
  }, [lightingSettings]);

  // Apply Camera Presets
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    if (cameraPreset === 'front') {
      cameraRef.current.position.set(0, 1.4, 4.8);
    } else if (cameraPreset === 'side') {
      cameraRef.current.position.set(5.2, 1.4, 0);
    } else if (cameraPreset === 'top') {
      cameraRef.current.position.set(0, 8.5, 0.12);
    } else if (cameraPreset === 'isometric') {
      cameraRef.current.position.set(4.2, 4.0, 4.2);
    } else {
      // perspective default elevated showcase view
      cameraRef.current.position.set(0, 2.4, 4.6);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, [cameraPreset]);

  // Auto-Rotate Turntable
  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.autoRotate = autoRotate;
    controlsRef.current.autoRotateSpeed = 1.8;
  }, [autoRotate]);

  // High-Res Screenshot Trigger
  useEffect(() => {
    if (screenshotTrigger === 0 || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `3d-model-showcase-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [screenshotTrigger]);

  // Export GLTF / GLB Trigger
  useEffect(() => {
    if (exportGLBTrigger === 0 || !modelGroupRef.current) return;

    const exporter = new GLTFExporter();
    exporter.parse(
      modelGroupRef.current,
      (gltf) => {
        const output = JSON.stringify(gltf, null, 2);
        const blob = new Blob([output], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = `3d-asset-mesh.gltf`;
        link.href = URL.createObjectURL(blob);
        link.click();
      },
      (error) => {
        console.error('Error exporting GLTF:', error);
      },
      { binary: false }
    );
  }, [exportGLBTrigger]);

  // Export OBJ Trigger
  useEffect(() => {
    if (exportOBJTrigger === 0 || !modelGroupRef.current) return;

    const exporter = new OBJExporter();
    const result = exporter.parse(modelGroupRef.current);
    const blob = new Blob([result], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `3d-asset-mesh.obj`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }, [exportOBJTrigger]);

  return (
    <div 
      id="three-canvas-container"
      ref={containerRef} 
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
    />
  );
};
