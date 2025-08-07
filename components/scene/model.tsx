// @ts-nocheck
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useFBO, useTexture } from "@react-three/drei";
import * as THREE from "three";
import useMouse from "@/lib/hooks/useMouse";
import useDimension from "@/lib/hooks/useDimension";
import { vertex, fragment } from "./shaders";

export default function Model() {
  const { viewport } = useThree();
  const texture = useTexture("/brush.png");
  const imageTexture = useTexture("/images/img12.webp");
  const meshRefs = useRef([]);
  const [meshes, setMeshes] = useState([]);
  const mouse = useMouse();
  const device = useDimension();
  const [prevMouse, setPrevMouse] = useState({ x: 0, y: 0 });
  const [currentWave, setCurrentWave] = useState(0);
  const { gl, camera } = useThree();

  // Create scenes and cameras once, not on every frame
  const { imageScene, imageCamera } = useMemo(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      viewport.width / -2,
      viewport.width / 2,
      viewport.height / 2,
      viewport.height / -2,
      -1000,
      1000
    );
    camera.position.z = 2;
    scene.add(camera);

    const geometry = new THREE.PlaneGeometry(1, 1);
    const group = new THREE.Group();
    const material1 = new THREE.MeshBasicMaterial({ map: imageTexture });
    const image1 = new THREE.Mesh(geometry, material1);
    image1.position.x = 0; // Center horizontally
    image1.position.y = 0; // Center vertically
    image1.position.z = 1;
    image1.scale.x = viewport.width / 1;
    image1.scale.y = viewport.width / 1;
    group.add(image1);

    // Add black overlay
    const overlayGeometry = new THREE.PlaneGeometry(1, 1);
    const overlayMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    });
    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    overlay.position.x = 0;
    overlay.position.y = 0;
    overlay.position.z = 1.1; // Slightly in front of the image
    overlay.scale.x = viewport.width / 1;
    overlay.scale.y = viewport.width;
    group.add(overlay);

    scene.add(group);

    return { imageScene: scene, imageCamera: camera };
  }, [viewport.width, viewport.height, imageTexture]);

  const scene = useMemo(() => new THREE.Scene(), []);
  const max = 100;

  const uniforms = useRef({
    uDisplacement: { value: null },
    uTexture: { value: null },
    winResolution: {
      value: new THREE.Vector2(0, 0),
    },
  });

  const fboBase = useFBO(device.width, device.height);
  const fboTexture = useFBO(device.width, device.height);

  useEffect(() => {
    const generatedMeshes = Array.from({ length: max }).map((_, i) => (
      <mesh
        key={i}
        position={[0, 0, 0]}
        ref={(el) => (meshRefs.current[i] = el)}
        rotation={[0, 0, Math.random()]}
        visible={false}
      >
        <planeGeometry args={[60, 60, 1, 1]} />
        <meshBasicMaterial transparent={true} map={texture} />
      </mesh>
    ));
    setMeshes(generatedMeshes);
  }, [texture]);

  function setNewWave(x, y, currentWave) {
    const mesh = meshRefs.current[currentWave];
    if (mesh) {
      mesh.position.x = x;
      mesh.position.y = y;
      mesh.visible = true;
      mesh.material.opacity = 1;
      mesh.scale.x = 1.75;
      mesh.scale.y = 1.75;
    }
  }

  function trackMousePos(x, y) {
    if (Math.abs(x - prevMouse.x) > 0.1 || Math.abs(y - prevMouse.y) > 0.1) {
      setCurrentWave((currentWave + 1) % max);
      setNewWave(x, y, currentWave);
    }
    setPrevMouse({ x: x, y: y });
  }

  useFrame(({ gl, scene: finalScene }) => {
    try {
      const x = mouse.x - device.width / 2;
      const y = -mouse.y + device.height / 2;
      trackMousePos(x, y);

      meshRefs.current.forEach((mesh) => {
        if (mesh && mesh.visible) {
          mesh.rotation.z += 0.025;
          mesh.material.opacity *= 0.95;
          mesh.scale.x = 0.98 * mesh.scale.x + 0.155;
          mesh.scale.y = 0.98 * mesh.scale.y + 0.155;
        }
      });

      if (device.width > 0 && device.height > 0) {
        // Render brush strokes to FBO
        gl.setRenderTarget(fboBase);
        gl.clear();
        meshRefs.current.forEach((mesh) => {
          if (mesh && mesh.visible) {
            scene.add(mesh);
          }
        });
        gl.render(scene, camera);
        meshRefs.current.forEach((mesh) => {
          if (mesh && mesh.visible) {
            scene.remove(mesh);
          }
        });

        // Render image to FBO
        gl.setRenderTarget(fboTexture);
        gl.render(imageScene, imageCamera);

        // Set uniforms
        uniforms.current.uTexture.value = fboTexture.texture;
        uniforms.current.uDisplacement.value = fboBase.texture;

        // Render final scene
        gl.setRenderTarget(null);
        gl.render(finalScene, camera);

        uniforms.current.winResolution.value = new THREE.Vector2(
          device.width,
          device.height
        ).multiplyScalar(device.pixelRatio);
      }
    } catch (error) {
      console.error("Error in useFrame:", error);
    }
  }, 1);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up FBOs
      if (fboBase) {
        fboBase.dispose();
      }
      if (fboTexture) {
        fboTexture.dispose();
      }
    };
  }, [fboBase, fboTexture]);

  return (
    <group>
      {meshes}
      <mesh>
        <planeGeometry args={[device.width, device.height, 1, 1]} />
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent={true}
          uniforms={uniforms.current}
        />
      </mesh>
    </group>
  );
}
