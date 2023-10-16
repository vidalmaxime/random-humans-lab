import React, { useMemo, useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, Image } from "@react-three/drei";
import { BufferGeometry } from "three";
import * as THREE from "three";
extend({ BufferGeometry });

type ClickDensityPlotProps = {
  data: Array<{ x: number; y: number }>;
  userDeviceType: string;
  userPosition: { x: number; y: number };
};

type ClickData = {
  x: number; // Normalized between 0 and 1
  y: number; // Normalized between 0 and 1
}[];

const GRID_SIZE = 50;
const WIDTH = 1;
const HEIGHT = 1;

const ClickDensityPlot: React.FC<ClickDensityPlotProps> = ({
  data,
  userDeviceType,
  userPosition,
}) => {
  const [positionMultiplier, setPositionMultiplier] = useState<number[]>([
    1, 1,
  ]);

  function createHistogram(data: ClickData, gridSize: number): number[][] {
    const histogram = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(0)
    );

    for (let click of data) {
      const ix = Math.floor(click.x * gridSize);
      const iy = Math.floor(click.y * gridSize);
      histogram[ix][iy]++;
    }

    return histogram;
  }

  function densityFromHistogram(
    x: number,
    y: number,
    histogram: number[][],
    sigma: number = 0.3
  ) {
    let sum = 0;

    const gridSize = histogram.length;
    const dx = Math.floor(x * gridSize);
    const dy = Math.floor(y * gridSize);

    // Ensure that dx and dy indices don't exceed the gridSize
    if (dx >= gridSize || dy >= gridSize || dx < 0 || dy < 0) return 0;

    for (
      let iy = Math.max(0, dy - 3);
      iy <= Math.min(dy + 3, gridSize - 1);
      iy++
    ) {
      for (
        let ix = Math.max(0, dx - 3);
        ix <= Math.min(dx + 3, gridSize - 1);
        ix++
      ) {
        const distance = Math.sqrt(
          (ix / gridSize - x) ** 2 + (iy / gridSize - y) ** 2
        );
        sum += histogram[ix][iy] * gaussian1D(distance, sigma);
      }
    }

    return sum;
  }

  function gaussian1D(distance: number, sigma: number = 0.3) {
    return Math.exp(-Math.pow(distance, 2) / (2 * sigma * sigma));
  }

  function createAdjustedBufferGeometry(
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number,
    data: ClickData
  ) {
    const histogram = createHistogram(data, GRID_SIZE);

    const gridX = Math.floor(widthSegments) || 1;
    const gridY = Math.floor(heightSegments) || 1;

    // Compute min and max densities
    let minDensity = Infinity;
    let maxDensity = -Infinity;

    for (let iy = 0; iy < GRID_SIZE; iy++) {
      for (let ix = 0; ix < GRID_SIZE; ix++) {
        const x = (ix / GRID_SIZE) * width;
        const y = (iy / GRID_SIZE) * height;
        const density = densityFromHistogram(x, y, histogram);

        if (density < minDensity) minDensity = density;
        if (density > maxDensity) maxDensity = density;
      }
    }

    const positions = [];
    const colors = [];

    let devicePositionMultiplier;
    if (userDeviceType === "mobile") {
      devicePositionMultiplier = [2.5, 4];
    } else {
      devicePositionMultiplier = [4, 1.9];
    }
    setPositionMultiplier(devicePositionMultiplier);

    for (let iy = 0; iy <= heightSegments; iy++) {
      const yNormalized = iy / heightSegments;
      for (let ix = 0; ix <= widthSegments; ix++) {
        const xNormalized = ix / widthSegments;
        const rawDensity = densityFromHistogram(
          xNormalized,
          yNormalized,
          histogram
        );

        // Normalize the density
        const normalizedDensity =
          (rawDensity - minDensity) / (maxDensity - minDensity);

        positions.push(
          xNormalized * positionMultiplier[0],
          -yNormalized * positionMultiplier[1],
          normalizedDensity
        );

        const color = new THREE.Color();
        color.setHSL(
          0,
          normalizedDensity,
          (1 - normalizedDensity) * 0.5 + normalizedDensity * 0.5
        );

        colors.push(color.r, color.g, color.b);
      }
    }

    const indices = [];
    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + gridX * iy;
        const b = ix + gridX * (iy + 1);
        const c = ix + 1 + gridX * (iy + 1);
        const d = ix + 1 + gridX * iy;

        // We create two triangles for each rectangle
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setIndex(indices);

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    return geometry;
  }

  const geometry = useMemo(() => {
    return createAdjustedBufferGeometry(1, 1, 100, 100, data);
  }, [data]);

  const camera = new THREE.PerspectiveCamera(
    userDeviceType === "mobile" ? 75 : 35,
    window.innerWidth / window.innerHeight,
    0.0001,
    100
  );

  const isMobile = userDeviceType === "mobile";
  camera.fov = isMobile ? 45 : 15;
  camera.position.x = isMobile ? 0 : 0;
  camera.position.y = isMobile ? -9 : -8;
  camera.position.z = isMobile ? 2 : 3;

  return (
    <Canvas className="w-full h-full" camera={camera}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <mesh
        key={0}
        position={[
          isMobile
            ? userPosition.x * positionMultiplier[0] - 1.3
            : userPosition.x * positionMultiplier[0] - 2, // Scale and translate the x-coordinate
          -userPosition.y * positionMultiplier[1], // Scale and translate the y-coordinate
          0.7, // Slightly above the heatmap for visibility
        ]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <sphereGeometry attach="geometry" args={[0.03, 16, 16]} />
        <Image
          position={[0, 0.1, 0]}
          url="/click-icon.svg"
          transparent
          scale={0.15}
        ></Image>
        <meshStandardMaterial attach="material" color="black" />
      </mesh>

      <mesh position={[isMobile ? -1.3 : -2, 0, 0]} rotation={[0, 0, 0]}>
        <primitive attach="geometry" object={geometry} />
        <meshStandardMaterial attach="material" vertexColors={true} />
      </mesh>

      <OrbitControls />
    </Canvas>
  );
};

export default ClickDensityPlot;
