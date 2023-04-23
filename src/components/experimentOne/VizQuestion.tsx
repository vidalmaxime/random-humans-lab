import React, { useState } from "react";

export default function VizQuestion({ send }: VizQuestion) {
  const [number, setNumber] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: any) => {
    setNumber(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = (e: any) => {
    if (submitted) return;
    e.preventDefault();
    if (!number) return;
    if (/^\d+$/.test(number)) {
      send(parseInt(number));
      setSubmitted(true);
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Enter a number between 0 and infinity"
        className="border-2 border-black rounded-md p-2 w-96 text-black"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

type VizQuestion = {
  send: (number: number) => void;
};
