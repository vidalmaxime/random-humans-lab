import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

export default function BarFreq({
  frequencies,
  title,
  yDataKey,
}: BarFreqProps) {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="md:hidden">
          <p className="label">{`${label}`}</p>{" "}
          {/* ${payload[0].value} for y value */}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      <h1 className="text font-bold mb-4">{title}</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={frequencies}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar
            dataKey={yDataKey}
            fill="#FFFFFF"
            fillOpacity={0.9}
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
