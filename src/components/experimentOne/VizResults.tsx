import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../../../firebase";
import BarFreq from "./BarFreq";

const maxNumBars = 10;

export default function VizResults() {
  const [userAnswer, setUserAnswer] = useState("");
  const [primeFactorsFrequencies, setPrimeFactorsFrequencies] = useState([]);
  const [valuesFrequencies, setValuesFrequencies] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "experiment_1", user.uid);
      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          setUserAnswer(doc.data().answer);
        }
      });
    }
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "experiment_1", "general");
      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          const primeFactors = doc.data().numberFactors;
          const values = doc.data().answers;
          const primeFactorsFreq = computeFrequency(primeFactors, maxNumBars);
          setPrimeFactorsFrequencies(primeFactorsFreq);
          const valuesFreq = computeFrequency(values, maxNumBars);
          setValuesFrequencies(valuesFreq);
        }
      });
    }
  }, []);

  const computeFrequency = (values: any, maxNum: number) => {
    // Compute the frequency of each number in the array and store in array of objects
    let count = 0;
    const occurrences = values.reduce((acc: any, curr: any) => {
      count += 1;
      const index = acc.findIndex((obj: any) => obj.name === curr);
      if (index === -1) {
        acc.push({ name: curr, frequency: 1 });
      } else {
        acc[index].frequency += 1;
      }
      return acc;
    }, []);
    // Normalize the frequency
    occurrences.forEach((obj: any) => {
      obj.frequency = obj.frequency / count;
    });
    // Sort the array by frequency
    occurrences.sort((a: any, b: any) => b.frequency - a.frequency);
    // Keep only the most frequent values
    occurrences.splice(maxNum);
    return occurrences;
  };

  return (
    <div className="text-black flex flex-col items-center">
      <h1 className="font-bold mb-16 text-2xl">Here are the results</h1>
      <p>your answer</p>
      <p>{userAnswer}</p>
      <BarFreq
        frequencies={valuesFrequencies}
        title={`Repartition of the ${maxNumBars} most frequent numbers`}
      />
      <BarFreq
        frequencies={primeFactorsFrequencies}
        title={`Repartition of the ${maxNumBars} most frequent number of prime factors if number is integer`}
      />
    </div>
  );
}
