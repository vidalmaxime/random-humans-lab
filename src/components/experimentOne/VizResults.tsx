import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

import { auth, db } from "../../../firebase";
import BarFreq from "./BarFreq";

const maxNumBars = 10;

export default function VizResults() {
  const [userAnswer, setUserAnswer] = useState("");
  const [primeFactorsFrequencies, setPrimeFactorsFrequencies] = useState([]);
  const [valuesOccurrences, setValuesOccurrences] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userAnswerCount, setUserAnswerCount] = useState(0);
  const [totalPicks, setTotalPicks] = useState(0);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  function getCountByName(arr: any, queryName: string) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name === queryName) {
        return arr[i].count;
      }
    }
    return null; // return null if the query name is not found in the array
  }
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
          const [primeFactorsFreq, count] = computeFrequency(primeFactors, maxNumBars);
          setPrimeFactorsFrequencies(primeFactorsFreq);
          const valuesOcc = getOccurrences(values, maxNumBars);
          setValuesOccurrences(valuesOcc);
          const countByName = getCountByName(valuesOcc, userAnswer);
          setUserAnswerCount(countByName);
          setTotalPicks(count);
        }
      });
    }
  }, []);

  const getOccurrences = (values: any, maxNum: number) => {
    const occurrences = values.reduce((acc: any, curr: any) => {
      const index = acc.findIndex((obj: any) => obj.name === curr);
      if (index === -1) {
        acc.push({ name: curr, count: 1 });
      } else {
        acc[index].count += 1;
      }
      return acc;
    }, []);
    occurrences.sort((a: any, b: any) => b.count - a.count);
    // Keep only the most frequent values
    occurrences.splice(maxNum);
    return occurrences;
  };

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
    return [occurrences, count];
  };

  return (
    <div className="text-black flex flex-col items-center w-full">
      <h1 className="mb-4 text-xl">You picked {userAnswer},  {userAnswerCount === 1 ? "it’s the first time this number has been chosen out of " + { totalPicks } + " picks" : "this number has been chosen" + { userAnswerCount } + "times out of " + { totalPicks } + " picks"}</h1>


      <BarFreq
        frequencies={valuesOccurrences}
        title={`Occurences of Top ${maxNumBars} most frequent numbers`}
        yDataKey="count"
      />


      {/* Create a horizontal flex box for the following two components */}
      <div className="mt-16 cursor-pointer flex flex-row " onClick={toggleCollapse}>
        <h2 className=" text-lg text-green-500" >Click here for other data visualizations</h2>
        <Image src="/chevron-down.svg" alt="chevron" width={16} height={16} className={`${isCollapsed ? '' : 'rotate-180'} ml-2`} />
      </div>

      <div className={`${isCollapsed ? 'hidden' : 'block'}  flex flex-col items-center  w-full`}>

        <BarFreq
          frequencies={primeFactorsFrequencies}
          title={`Repartition of the ${maxNumBars} most frequent number of prime factors if number is integer`}
          yDataKey="frequency"
        />
      </div>
    </div >
  );
}
