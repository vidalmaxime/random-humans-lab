import React from "react";
import { motion } from "framer-motion";

export default function VizQuestion({
  send,
  setUserSkippedToResults,
}: VizQuestionProps) {
  const skipToResults = () => {
    setUserSkippedToResults(true);
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <img
        src="/joconde.jpeg"
        alt="joconde"
        className="md:w-96 w-48 cursor-pointer"
        onClick={(e) => {
          // Get the offset of the click relative to the image on a scale of 0 to 1
          const x =
            e.nativeEvent.offsetX / (e.target as HTMLImageElement).width;
          const y =
            e.nativeEvent.offsetY / (e.target as HTMLImageElement).height;
          send(x, y);
        }}
      />
      <motion.div
        className="mt-4 cursor-pointer flex flex-row items-center opacity-70"
        onClick={skipToResults}
        whileHover={{ opacity: 1 }}
      >
        <h2 className="text-lg text-green-500">skip to results</h2>
      </motion.div>
    </div>
  );
}

type VizQuestionProps = {
  send: (x: number, y: number) => void;
  setUserSkippedToResults: (skipped: boolean) => void;
};
