import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../../../firebase";
import BarPrimeFactors from "./BarPrimeFactors";

export default function VizResults() {
  const [userAnswer, setUserAnswer] = useState("");
  const [primeFactors, setPrimeFactors] = useState([]);

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
          // Compute the frequency of each number in the primeFactors array and store in array of objects
          const occurrences = primeFactors.reduce((acc: any, curr: any) => {
            const index = acc.findIndex((obj: any) => obj.name === curr);
            if (index === -1) {
              acc.push({ name: curr, frequency: 1 });
            } else {
              acc[index].frequency += 1;
            }
            return acc;
          }, []);
          console.log(occurrences);

          setPrimeFactors(occurrences);
        }
      });
    }
  }, []);

  return (
    <div className="text-black flex flex-col items-center">
      <h1 className="font-bold mb-16 text-2xl">Here are the results</h1>
      <p>your answer</p>
      <p>{userAnswer}</p>
      <BarPrimeFactors occurrences={primeFactors} />
    </div>
  );
}
