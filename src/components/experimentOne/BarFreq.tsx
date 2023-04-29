import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BarFreq({ frequencies, title }: BarFreqProps) {
  return (
    <div className="mt-16 flex flex-col items-center">
      <h1 className="text font-bold">{title}</h1>
      <ResponsiveContainer width={500} height={300}>
        <BarChart
          width={500}
          height={300}
          data={frequencies}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="frequency"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type BarFreqProps = {
  frequencies: Object[];
  title: string;
};
