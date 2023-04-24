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

export default function BarPrimeFactors({ occurrences }: BarPrimeFactorsProps) {
  return (
    <div className="mt-16 flex flex-col items-center">
      <h1 className="text font-bold">
        Repartition of number of prime factors if number given was an integer
      </h1>
      <ResponsiveContainer width={500} height={300}>
        <BarChart
          width={500}
          height={300}
          data={occurrences}
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
          <Legend />
          <Bar dataKey="frequency" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type BarPrimeFactorsProps = {
  occurrences: Object[];
};
