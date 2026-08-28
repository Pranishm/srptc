/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import * as THREE from 'three';

import { 
  ShadingMode, 
  CameraPreset, 
  MaterialSettings, 
  LightingSettings
} from './types';
import { 
  PRESET_MODELS, 
  generateProceduralTextures 
} from './utils/proceduralAssets';

import { TopBar } from './components/TopBar';
import { MaterialModal } from './components/MaterialModal';
import { LightModal } from './components/LightModal';
import { ThreeCanvas } from './components/ThreeCanvas';

export default function App() {
  // Current Campus Complex Model
  const currentPreset = useMemo(() => {
    return PRESET_MODELS[0];
  }, []);

  // Procedural Textures & Data URLs
  const pbrCanvases = useMemo(() => {
    return generateProceduralTextures(currentPreset.generatorKey);
  }, [currentPreset.generatorKey]);

  // Viewport Settings State
  const [shadingMode, setShadingMode] = useState<ShadingMode>('shaded');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Material Popover Settings
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    metalness: 0.87,
    roughness: 1.00,
    normalScale: 3.0,
    wireframe: false,
    wireframeColor: '#38bdf8',
    wireframeOpacity: 0.7,
    emissiveColor: '#00f0ff',
    emissiveIntensity: 5.0,
    clearcoat: 0.2,
    transmission: 0,
    opacity: 1,
  });

  // Lighting Popover Settings
  const [isLightModalOpen, setIsLightModalOpen] = useState(false);
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>({
    preset: 'studio',
    intensity: 1.0,
    lightColor: '#ffffff',
    sunElevation: 45,
    sunAzimuth: 135,
    shadows: true,
    groundGrid: true,
    gridColor: '#272738',
    bgColor: '#121215',
    bgMode: 'dark',
  });

  return (
    <div 
      id="main-showcase-container"
      className="flex flex-1 flex-col gap-2 md:flex-2 h-screen w-screen overflow-hidden bg-bg-base p-0 sm:p-2 select-none"
    >
      <div data-testid="community-showcase-detail" className="bg-[#0F0F11] flex flex-col overflow-hidden rounded-none sm:rounded-lg flex-1 border border-white/10 shadow-2xl">
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0">
            <div className="relative z-0 flex size-full flex-col">
              
              {/* Top Navigation & Controls Toolbar */}
              <TopBar
                autoRotate={autoRotate}
                onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
              />

              {/* 3D Viewport Area */}
              <div className="flex min-h-0 flex-1 relative">
                <div className="relative min-h-0 min-w-0 flex-1 bg-gradient-to-b from-[#121316] to-[#0a0a0d]">
                  
                  {/* Three.js Interactive WebGL Viewport */}
                  <ThreeCanvas
                    generatorKey={currentPreset.generatorKey}
                    pbrCanvases={pbrCanvases}
                    shadingMode={shadingMode}
                    cameraPreset={cameraPreset}
                    materialSettings={materialSettings}
                    lightingSettings={lightingSettings}
                    autoRotate={autoRotate}
                  />

                  {/* Material Adjustment Popover Modal */}
                  <MaterialModal
                    isOpen={isMaterialModalOpen}
                    onClose={() => setIsMaterialModalOpen(false)}
                    settings={materialSettings}
                    onChange={(updated) => setMaterialSettings((prev) => ({ ...prev, ...updated }))}
                    onReset={() =>
                      setMaterialSettings({
                        metalness: 0.87,
                        roughness: 1.00,
                        normalScale: 3.0,
                        wireframe: false,
                        wireframeColor: '#F27D26',
                        wireframeOpacity: 0.7,
                        emissiveColor: '#00f0ff',
                        emissiveIntensity: 5.0,
                        clearcoat: 0.2,
                        transmission: 0,
                        opacity: 1,
                      })
                    }
                  />

                  {/* Lighting & Environment Popover Modal */}
                  <LightModal
                    isOpen={isLightModalOpen}
                    onClose={() => setIsLightModalOpen(false)}
                    settings={lightingSettings}
                    onChange={(updated) => setLightingSettings((prev) => ({ ...prev, ...updated }))}
                    onReset={() =>
                      setLightingSettings({
                        preset: 'studio',
                        intensity: 1.0,
                        lightColor: '#ffffff',
                        sunElevation: 45,
                        sunAzimuth: 135,
                        shadows: true,
                        groundGrid: true,
                        gridColor: '#272738',
                        bgColor: '#0F0F11',
                        bgMode: 'dark',
                      })
                    }
                  />

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
