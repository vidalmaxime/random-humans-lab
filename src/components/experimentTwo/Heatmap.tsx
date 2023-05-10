import React, { useEffect, useState } from "react";
import { ReferenceArea, ScatterChart, Scatter, XAxis, YAxis } from "recharts";

const aspectRatio = 1200 / 1792;
const width = 300;
const height = width / aspectRatio;
const numberSectorsPerDim = 10;

// Divide the image in 10x10 sectors
const sectors: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  count: number;
}[] = [];
for (let i = 0; i < numberSectorsPerDim; i++) {
  for (let j = 0; j < numberSectorsPerDim; j++) {
    sectors.push({
      x1: (i * width) / numberSectorsPerDim,
      x2: ((i + 1) * width) / numberSectorsPerDim,
      y1: (j * height) / numberSectorsPerDim,
      y2: ((j + 1) * height) / numberSectorsPerDim,
      count: 0,
    });
  }
}

export default function Heatmap({ positions, title }: HeatmapProps) {
  const [heatSectors, setHeatSectors] = useState(sectors);
  const [processedPositions, setProcessedPositions] = useState([{}]);
  const [maxCount, setMaxCount] = useState(0);

  useEffect(() => {
    // Process positions by multiplying by the width and height and inverting the y axis
    const tempPositions = positions.map((position) => ({
      x: position.x * width,
      y: height - position.y * height,
    }));
    setProcessedPositions(tempPositions);

    // Update the heat sectors with the number of positions in each and update maxCount
    const tempSectors = heatSectors;
    tempSectors.forEach((sector) => {
      sector.count = tempPositions.filter(
        (position) =>
          position.x >= sector.x1 &&
          position.x <= sector.x2 &&
          position.y >= sector.y1 &&
          position.y <= sector.y2
      ).length;
    });
    setHeatSectors(tempSectors);
    setMaxCount(
      Math.max.apply(
        Math,
        tempSectors.map((sector) => sector.count)
      )
    );
  }, [positions]);

  return (
    <div className="mt-16 flex flex-col items-center w-full">
      <h1 className="text font-bold mb-4">{title}</h1>
      <div className="relative">
        <ScatterChart
          width={width}
          height={height}
          margin={{
            right: 2,
            bottom: 2,
          }}
          className="border-black border-2 "
        >
          {
            /*
                      Map the various heat sectors as ReferenceAreas onto the pitch,
                      using `sector.count` to determine opacity
                  */
            heatSectors.map((sector, index) => (
              <ReferenceArea
                key={index}
                x1={sector.x1}
                x2={sector.x2}
                y1={sector.y1}
                y2={sector.y2}
                fill="red"
                fillOpacity={sector.count / maxCount}
                stroke="white"
                strokeOpacity={0}
              />
            ))
          }
          <XAxis type="number" dataKey="x" hide domain={[0, width]} />
          <YAxis type="number" dataKey="y" hide domain={[0, height + 1]} />
          <Scatter
            name="Heatmap"
            data={processedPositions}
            shape={
              // A custom shape that is a circle with a radius of 2
              ({ cx, cy }) => <circle cx={cx} cy={cy} r={2} fill="black" />
            }
          />
        </ScatterChart>
        <img
          src="/joconde.jpeg"
          alt="joconde"
          width={width}
          height={height}
          className="absolute opacity-50 top-0"
        />
      </div>
    </div>
  );
}

type HeatmapProps = {
  positions: { x: number; y: number }[];
  title: string;
};
