import React, { useState } from "react";
import { motion } from "framer-motion";

export default function VizQuestion({ send }: VizQuestionProps) {
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
    if (matchExact(/(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/, number)) {
      const parsedNumber = parseFloat(number);
      if (number > 0) {
        let numberFactors = 0;
        if (Number.isInteger(parsedNumber) && parsedNumber > 0) {
          numberFactors = primeFactors(parsedNumber).length;
        }
        send(parsedNumber, numberFactors);
        setSubmitted(true);
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

  return (
    <div className="flex justify-center flex-col items-center">
      <p className="text-black mb-8">
        This experiment is heavily inspired by David Chalmers&apos; original{" "}
        <a
          target="_blank"
          href="https://consc.net/notes/pick-a-number.html"
          className="text-green-500"
        >
          experiment
        </a>
        .
      </p>
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Enter a number between 0 and infinity"
          className="border-2 border-black rounded-md p-2 w-96 text-black"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <motion.button
          className="bg-black text-white rounded-md p-2 ml-2"
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
    </div>
  );
}

type VizQuestionProps = {
  send: (number: number, numberFactors: number) => void;
};
