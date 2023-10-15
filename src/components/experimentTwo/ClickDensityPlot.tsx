import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Text } from "@react-three/drei";

import { extend } from "@react-three/fiber";
import { BufferGeometry } from "three";
import * as THREE from "three";

extend({ BufferGeometry });

type ClickDensityPlotProps = {
  data: Array<{ x: number; y: number }>;
  userDeviceType: string;
};

type ClickData = {
  x: number; // Normalized between 0 and 1
  y: number; // Normalized between 0 and 1
}[];

const GRID_SIZE = 50;

const ClickDensityPlot: React.FC<ClickDensityPlotProps> = ({
  data,
  userDeviceType,
}) => {
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

  // function gaussian(
  //   x: number,
  //   y: number,
  //   cx: number,
  //   cy: number,
  //   sigma: number = 0.3
  // ) {
  //   const dx = x - cx;
  //   const dy = y - cy;
  //   return Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
  // }

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

        let positionMultiplier;
        if (userDeviceType == "mobile") {
          positionMultiplier = [2, 4];
        } else {
          positionMultiplier = [4, 2];
        }

        let mobilePositions = {};

        positions.push(
          xNormalized * positionMultiplier[0] - width / 2,
          yNormalized * positionMultiplier[1] - height / 2,
          normalizedDensity
        );

        const color = new THREE.Color();
        color.setHSL(0.6 - normalizedDensity * 0.6, 1.0, 0.5);
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
    35,
    window.innerWidth / window.innerHeight,
    0.0001,
    100
  );
  camera.position.z = 3; // Set the camera's position
  camera.position.y = 3;

  return (
    <Canvas className="w-full h-full" camera={camera}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <mesh position={[-1.5, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive attach="geometry" object={geometry} />
        <meshStandardMaterial attach="material" vertexColors={true} />
      </mesh>

      <OrbitControls />
    </Canvas>
  );
};

export default ClickDensityPlot;
