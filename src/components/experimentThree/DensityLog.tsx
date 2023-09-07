import React from "react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DensityLog({ points, title }: DensityLogProps) {
  return (
    <div className="mt-16 flex flex-col items-center w-full">
      <h1 className="text font-bold mb-4">{title}</h1>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={500}
          height={400}
          data={points}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bin" />
          <YAxis />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#000000"
            fill="#FFFFFF"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

type DensityLogProps = {
  points: Object[];
  title: string;
};
