import React, { useState } from "react";
import { motion } from "framer-motion";
import { Colorful } from "@uiw/react-color";

import { haasgrotdisp } from "@/styles/fonts";

export default function VizQuestion({ send }: VizQuestionProps) {
  const [hex, setHex] = useState("#f8f8f8");
  const [submitted, setSubmitted] = useState(false);

  // check if the word is valid: length > 0, it's a single word without spaces, and length < 60
  const handleSubmit = (e: any) => {
    if (submitted) return;
    e.preventDefault();
    setSubmitted(true);
    send(hex);
  };

  return (
    <div className="flex justify-center flex-col items-center w-full">
      <div
        className="flex justify-center flex-wrap items-center w-96 rounded-lg p-16"
        style={{ backgroundColor: hex }}
      >
        <Colorful
          color={hex}
          onChange={(color) => {
            setHex(color.hex);
          }}
          disableAlpha={true}
        />
      </div>
      <motion.button
        className={`bg-black text-white rounded-md p-2 ml-2 my-2 ${haasgrotdisp.className}`}
        onClick={handleSubmit}
        whileHover={{
          scale: 1.1,
        }}
      >
        SUBMIT
      </motion.button>
    </div>
  );
}

type VizQuestionProps = {
  send: (color: string) => void;
};
