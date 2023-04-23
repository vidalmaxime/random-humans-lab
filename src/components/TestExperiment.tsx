import React from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

function TestExperiment({ name }: TestExperimentProps) {
  return (
    <div>
      <p className="text-black"> {name}</p>
    </div>
  );
}

type TestExperimentProps = {
  name: string;
};

export default TestExperiment;
