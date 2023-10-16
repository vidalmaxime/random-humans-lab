import React, { useState } from "react";
import { motion } from "framer-motion";

import { haasgrotdisp } from "@/styles/fonts";

export default function VizQuestion({ send }: VizQuestionProps) {
  const [word, setWord] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [warningGiveWord, setWarningGiveWord] = useState(false);

  const handleChange = (e: any) => {
    setWord(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  // check if the word is valid: length > 0, it's a single word without spaces, and length < 60
  const handleSubmit = (e: any) => {
    if (submitted) return;
    e.preventDefault();
    if (word.length === 0 || word.includes(" ") || word.length > 60) {
      setWarningGiveWord(true);
      setTimeout(() => {
        setWarningGiveWord(false);
      }, 2000);
      return;
    } else {
      // make the word lowercase
      console.log(word.toLowerCase());
      setSubmitted(true);
      send(word.toLowerCase());
    }
  };

  return (
    <div className="flex justify-center flex-col items-center w-full">
      <div className="flex justify-center flex-wrap items-center w-full">
        <input
          type="text"
          placeholder="Enter any word"
          className="border-2 border-black rounded-md p-2 w-full md:w-96 text-black"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus={true}
        />
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
      {warningGiveWord && (
        <p className="text-red-500">Please enter a valid word</p>
      )}
    </div>
  );
}

type VizQuestionProps = {
  send: (word: string) => void;
};
