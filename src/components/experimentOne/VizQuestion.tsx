import React, { useState } from "react";

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
  };

  return (
    <div className="flex justify-center">
      <input
        type="text"
        placeholder="Enter a number between 0 and infinity"
        className="border-2 border-black rounded-md p-2 w-96 text-black"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-black text-white rounded-md p-2 ml-2"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {warningGiveNumber && (
        <p className="text-red-500 absolute">Please enter a valid number</p>
      )}
    </div>
  );
}

type VizQuestionProps = {
  send: (number: number, numberFactors: number) => void;
};
