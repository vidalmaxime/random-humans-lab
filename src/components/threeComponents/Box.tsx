import React, { useRef } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";

function Box(props: any) {
  const myMesh = useRef<any>();

  useFrame(() => {
    myMesh.current.rotation.x += 0.01;
    myMesh.current.rotation.y += 0.01;
  });

  return (
    <mesh {...props} recieveShadow={true} castShadow ref={myMesh}>
      <boxBufferGeometry args={[4, 4, 4]} />
      <meshPhysicalMaterial color={"#8F69FC"} />
    </mesh>
  );
}
export default Box;
