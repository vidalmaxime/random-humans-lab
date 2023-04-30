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

export default function BarFreq({
  frequencies,
  title,
  yDataKey,
}: BarFreqProps) {
  return (
    <div className="mt-16 flex flex-col items-center w-full">
      <h1 className="text font-bold mb-4">{title}</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
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
          <Bar
            dataKey={yDataKey}
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth={1}
            label={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type BarFreqProps = {
  frequencies: Object[];
  title: string;
  yDataKey: string;
};
