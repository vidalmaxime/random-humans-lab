import React from "react";
import { motion } from "framer-motion";

export default function VizQuestion({ send }: VizQuestionProps) {
  return (
    <div className="flex justify-center flex-col items-center">
      click
      <svg
        className="md:w-96 w-full cursor-pointer"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => {
          // Get the offset of the click relative to the svg rectangle on a scale of 0 to 1
          const x = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
          const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight;
          console.log(x, y);
          console.log(
            e.currentTarget.clientWidth,
            e.currentTarget.clientHeight
          );

          send(x, y);
        }}
      >
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="transparent"
          stroke="black"
          strokeWidth="1"
        />
      </svg>
      <motion.div
        className="mt-4 cursor-pointer flex flex-row items-center opacity-70"
        onClick={skipToResults}
        whileHover={{ opacity: 1 }}
      ></motion.div>
    </div>
  );
}

type VizQuestionProps = {
  send: (x: number, y: number) => void;
};
