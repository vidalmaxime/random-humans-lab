import React, { useState } from "react";
import { motion } from "framer-motion";

export default function VizQuestion({
  send,
  setUserSkippedToResults,
}: VizQuestionProps) {
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
      send(word);
      setSubmitted(true);
    }
  };

  const skipToResults = () => {
    setUserSkippedToResults(true);
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
          className="bg-black text-white rounded-md p-2 ml-2 my-2"
          onClick={handleSubmit}
          whileHover={{
            scale: 1.1,
          }}
        >
          Submit
        </motion.button>
      </div>
      {warningGiveWord && (
        <p className="text-red-500">Please enter a valid word</p>
      )}
      <motion.div
        className="mt-12 cursor-pointer flex flex-row items-center opacity-70"
        onClick={skipToResults}
        whileHover={{ opacity: 1 }}
      >
        <h2 className="text-lg text-green-500">skip to results</h2>
      </motion.div>
    </div>
  );
}

type VizQuestionProps = {
  send: (word: string) => void;
  setUserSkippedToResults: (skipped: boolean) => void;
};
