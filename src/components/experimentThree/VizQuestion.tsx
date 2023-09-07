import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SkewLoader from "react-spinners/SkewLoader";

export default function VizQuestion({ send }: VizQuestionProps) {
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  return (
    <div className="flex justify-center flex-col items-center w-full">
      {submitted ? (
        <SkewLoader color="black" speedMultiplier={0.5} />
      ) : (
        <motion.button
          onClick={() => {
            const endTime = Date.now();
            const timeTaken = endTime - startTime.current;
            send(timeTaken);
            setSubmitted(true);
          }}
        >
          <p>Back</p>
        </motion.button>
      )}
    </div>
  );
}

type VizQuestionProps = {
  send: (number: number) => void;
};
