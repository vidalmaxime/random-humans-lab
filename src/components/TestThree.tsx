import React from "react";

import { Canvas } from "@react-three/fiber";

import LightBulb from "./threeComponents/LightBulb";
import Box from "./threeComponents/Box";

export default function TestThree() {
  return (
    <Canvas
      style={{ height: "30vh", width: "30vh" }}
      shadows
      camera={{
        position: [-4, 4, 4],
      }}
    >
      <ambientLight color={"white"} intensity={0.3} />
      <mesh receiveShadow>
        <LightBulb position={[0, 6, 0]} />
        <Box rotateX={3} rotateY={0.2} position={[0, 0, 0]} />
      </mesh>
    </Canvas>
  );
}
