import React, { useState } from "react";
import { motion } from "framer-motion";

export default function VizQuestion({
  send,
  setUserSkippedToResults,
}: VizQuestionProps) {
  const [number, setNumber] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [warningGiveNumber, setWarningGiveNumber] = useState(false);

  const handleChange = (e: any) => {
    setNumber(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  function matchExact(r: RegExp, str: string) {
    var match = str.match(r);
    return match && str === match[0];
  }

  function primeFactors(n: number) {
    const factors = [];
    let divisor = 2;

    while (n >= 2) {
      if (n % divisor == 0) {
        factors.push(divisor);
        n = n / divisor;
      } else {
        divisor++;
      }
    }
    return factors;
  }

  const handleSubmit = (e: any) => {
    if (submitted) return;
    e.preventDefault();
    if (!number) return;

    if (number > Number.MAX_VALUE) {
      send(Number.POSITIVE_INFINITY, -1);
      setSubmitted(true);
      return;
    }

    if (matchExact(/(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/, number)) {
      const parsedNumber = parseFloat(number);
      if (number > 0) {
        if (number <= 1000) {
          let numberFactors = 0;
          if (Number.isInteger(parsedNumber) && parsedNumber > 0) {
            numberFactors = primeFactors(parsedNumber).length;
          }
          send(parsedNumber, numberFactors);
          setSubmitted(true);
        } else {
          send(parsedNumber, -1);
          setSubmitted(true);
        }
      } else {
        setWarningGiveNumber(true);
        setTimeout(() => {
          setWarningGiveNumber(false);
        }, 2000);
      }
    } else {
      setWarningGiveNumber(true);
      setTimeout(() => {
        setWarningGiveNumber(false);
      }, 2000);
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
          placeholder="Enter a number between 0 and infinity"
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
      {warningGiveNumber && (
        <p className="text-red-500">Please enter a valid number</p>
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
  send: (number: number, numberFactors: number) => void;
  setUserSkippedToResults: (skipped: boolean) => void;
};
