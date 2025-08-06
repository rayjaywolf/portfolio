"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import "@/lib/webgl/materials/MeshImageMaterial";

interface BillboardProps {
  texture: THREE.Texture;
  dimensions: any;
  radius?: number;
  [key: string]: any;
}

function setupCylinderTextureMapping(
  texture: THREE.Texture,
  dimensions: any,
  radius: number,
  height: number
) {
  const cylinderCircumference = 2 * Math.PI * radius;
  const cylinderHeight = height;
  const cylinderAspectRatio = cylinderCircumference / cylinderHeight;

  if (dimensions.aspectRatio > cylinderAspectRatio) {
    // Canvas is wider than cylinder proportionally
    texture.repeat.x = cylinderAspectRatio / dimensions.aspectRatio;
    texture.repeat.y = 1;
    texture.offset.x = (1 - texture.repeat.x) / 2;
  } else {
    // Canvas is taller than cylinder proportionally
    texture.repeat.x = 1;
    texture.repeat.y = dimensions.aspectRatio / cylinderAspectRatio;
  }

  // Center the texture
  texture.offset.y = (1 - texture.repeat.y) / 2;
}

function Billboard({
  texture,
  dimensions,
  radius = 5,
  ...props
}: BillboardProps) {
  const ref = useRef<THREE.Mesh>(null);

  setupCylinderTextureMapping(texture, dimensions, radius, 2);

  useFrame((state, delta) => {
    if (texture) texture.offset.x += delta * 0.001;
  });

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[radius, radius, 2, 100, 1, true]} />
      {/* @ts-ignore */}
      <meshImageMaterial
        map={texture}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

export default Billboard;
