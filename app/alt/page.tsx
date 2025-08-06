"use client";

import { Billboard, Banner } from "@/components/webgl";
import { Loader } from "@/components/ui/Loader";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import useCollageTexture from "@/lib/hooks/useCollageTexture";
import images from "@/lib/data/images";

const COUNT = 10;
const GAP = 3.2;

function Scene({ texture, dimensions }: { texture: any; dimensions: any }) {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={7}
        position={[0, 0, 100]}
        near={0.001}
        far={100000}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group rotation={[-0.15, 0, -0.2]}>
        {Array.from({ length: COUNT }).map((_, index) => [
          <Billboard
            key={`billboard-${index}`}
            radius={5}
            rotation={[0, index * Math.PI * 0.5, 0]}
            position={[0, (index - (Math.ceil(COUNT / 2) - 1)) * GAP, 0]}
            texture={texture}
            dimensions={dimensions}
          />,
          <Banner
            key={`banner-${index}`}
            radius={5.035}
            rotation={[0, 0, 0.085]}
            position={[
              0,
              (index - (Math.ceil(COUNT / 2) - 1)) * GAP - GAP * 0.5,
              0,
            ]}
          />,
        ])}
      </group>
    </>
  );
}

export default function Home() {
  const { texture, dimensions, isLoading, error } = useCollageTexture(images);

  console.log("Texture:", texture);
  console.log("Dimensions:", dimensions);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-black text-left">
          <h1 className="text-[96px] font-[400] mb-4">Creative Director</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-white">
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-screen pointer-events-none px-32">
        <h1 className="text-[96px] text-left font-[400] text-black leading-[0.9]">
          Creative <br /> Director
        </h1>
      </div>

      {/* Kinetic Images Background */}
      {texture && (
        <div className="absolute right-0 -mr-90 inset-0 z-0">
          <Canvas>
            <Scene texture={texture} dimensions={dimensions} />
          </Canvas>
        </div>
      )}
    </div>
  );
}
