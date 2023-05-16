import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useAnimate, motion, AnimatePresence } from "framer-motion";

import { auth, db } from "../../../firebase";
import BarFreq from "./BarFreq";
import DensityLog from "./DensityLog";

const maxNumBars = 10;

export default function VizResults() {
  const [userAnswer, setUserAnswer] = useState(-1);
  const [primeFactorsFrequencies, setPrimeFactorsFrequencies] = useState([]);
  const [valuesOccurrences, setValuesOccurrences] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [userAnswerCount, setUserAnswerCount] = useState(0);
  const [totalPicks, setTotalPicks] = useState(0);
  const [histogramPoints, setHistogramPoints] = useState([]);

  const [scope, animate] = useAnimate();

  const toggleCollapse = () => {
    animate(
      scope.current,
      { rotate: isCollapsed ? [0, 60] : [60, 0] },
      { duration: 0.3 }
    );
    setIsCollapsed(!isCollapsed);
  };

  function getCountByName(arr: any, queryName: string) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name === queryName) {
        return arr[i].count;
      }
    }
    return null;
  }

  useEffect(() => {
    // We chain retrieving of user answer and general data
    const user = auth.currentUser;
    if (user) {
      const userdocRef = doc(db, "experiment_1", user.uid);
      getDoc(userdocRef).then((userDoc) => {
        if (userDoc.exists()) {
          console.log(userDoc.data().answer);
          setUserAnswer(userDoc.data().answer);
        }
        const docRef = doc(db, "experiment_1", "general");
        getDoc(docRef).then((doc) => {
          if (doc.exists()) {
            const primeFactors = doc.data().numberFactors;
            const values = doc.data().answers;
            const [primeFactorsFreq, count] = computeFrequency(
              primeFactors,
              maxNumBars
            );
            setPrimeFactorsFrequencies(primeFactorsFreq);
            const valuesOcc = getOccurrences(values);
            setValuesOccurrences(valuesOcc);
            if (userDoc.exists()) {
              const countByName = getCountByName(
                valuesOcc,
                userDoc.data().answer
              );
              setUserAnswerCount(countByName);
            }
            valuesOcc.splice(maxNumBars);
            setTotalPicks(count);
            setHistogramPoints(computeHistogram(values, 10));
          }
        });
      });
    }
  }, []);

  const getOccurrences = (values: any) => {
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

    return occurrences;
  };

  const computeFrequency = (values: any, maxNum: number) => {
    // Compute the frequency of each number in the array and store in array of objects
    let count = 0;
    const occurrences = values.reduce((acc: any, curr: any) => {
      // Exclude value if it's equal to -1
      if (curr !== -1) {
        count += 1;
        const index = acc.findIndex((obj: any) => obj.name === curr);
        if (index === -1) {
          acc.push({ name: curr, frequency: 1 });
        } else {
          acc[index].frequency += 1;
        }
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

  const computeHistogram = (values: any, maxNum: number) => {
    // Create logaritmic bins
    const bins: any = [];
    for (let i = 0; i < maxNum; i++) {
      bins.push(Math.pow(10, i));
    }
    bins.push(Infinity);
    // Compute the histogram knowing that values is a simple array of numbers
    const histogram = values.reduce((acc: any, curr: any) => {
      const index = bins.findIndex((bin: any) => curr < bin);
      if (index === -1) {
        acc[acc.length - 1] += 1;
      } else {
        acc[index] += 1;
      }
      return acc;
    }, new Array(bins.length).fill(0));
    // Normalize the histogram
    const total = histogram.reduce((acc: any, curr: any) => acc + curr, 0);
    const normalizedHistogram = histogram.map((bin: any) => bin / total);
    // Make it as an array of objects with the bin and the count
    const histogramPoints = normalizedHistogram.map((bin: any, index: any) => {
      return { bin: bins[index], count: bin };
    });

    return histogramPoints;
  };

  return (
    <div className="text-black flex flex-col items-center w-full mb-32">
      {userAnswer !== -1 && userAnswer !== Infinity ? (
        <h1 className="mb-4 text-xl">
          you picked {userAnswer},{" "}
          {userAnswerCount === 1
            ? `it’s the first time this number has been chosen out of
            ${totalPicks}
             picks`
            : `this number has been chosen 
            ${userAnswerCount} 
            times out of
            ${totalPicks} 
            picks`}
        </h1>
      ) : userAnswer === Infinity ? (
        <h1 className="mb-4 text-xl">
          you overflowed into infinity,{" "}
          {userAnswerCount === 1
            ? `it’s the first time this happened out of ${totalPicks} picks`
            : `this is the ${userAnswerCount}th time it happens out of ${totalPicks} picks`}
        </h1>
      ) : (
        <h1 className="mb-4 text-xl">
          there has been {totalPicks} total picks
        </h1>
      )}

      <BarFreq
        frequencies={valuesOccurrences}
        title={`occurences of top ${maxNumBars} most frequent picks`}
        yDataKey="count"
      />

      <p className="text-black mb-2 mt-4">
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

      <motion.div
        className="mt-12 cursor-pointer flex flex-row items-center opacity-70"
        onClick={toggleCollapse}
        whileHover={{ opacity: 1 }}
      >
        <h2 className=" text-lg text-green-500">
          click here for other data visualizations
        </h2>
        <div className="ml-2" ref={scope}>
          <Image src="/chevron-down.svg" alt="chevron" width={16} height={16} />
        </div>
      </motion.div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className={"flex flex-col items-center w-full"}
            initial={{ y: -70 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DensityLog
              points={histogramPoints}
              title="distribution of picks in log scale"
            />
            <BarFreq
              frequencies={primeFactorsFrequencies}
              title={`distribution of top ${maxNumBars} most frequent number of prime factors per pick for picks < 1000`}
              yDataKey="frequency"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
