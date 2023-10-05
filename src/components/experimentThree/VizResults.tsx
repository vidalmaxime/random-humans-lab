import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { nanumMyeongjo } from "@/styles/fonts";

import { auth, db } from "../../../firebase";

export default function VizResults() {
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswerCount, setUserAnswerCount] = useState(0);
  const [allAnswers, setAllAnswers] = useState<any>([]);
  const [totalPicks, setTotalPicks] = useState(0);

  // Make a list of 300 random strings of 5 characters
  const randomStrings = [];
  for (let i = 0; i < 300; i++) {
    let randomString = "";
    for (let j = 0; j < 5; j++) {
      randomString += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    randomStrings.push(randomString);
  }

  function countOccurrences(arr: [], target: string) {
    let count = 0;
    for (let str of arr) {
      if (str === target) {
        count++;
      }
    }
    return count;
  }

  useEffect(() => {
    // We chain retrieving of user answer and general data
    const user = auth.currentUser;
    if (user) {
      const userdocRef = doc(db, "experiment_3", user.uid);
      getDoc(userdocRef).then((userDoc) => {
        if (userDoc.exists()) {
          setUserAnswer(userDoc.data().answer);
        }
        const docRef = doc(db, "experiment_3", "general");
        getDoc(docRef).then((doc) => {
          if (doc.exists()) {
            const words = doc.data().answers;
            setAllAnswers(words);
            setTotalPicks(words.length);
            setUserAnswerCount(countOccurrences(words, userAnswer));
          }
        });
      });
    }
  }, []);

  return (
    <div className="text-black flex flex-col items-center w-full mb-32">
      {userAnswer !== "" ? (
        <h1 className="mb-4 text-xl">
          you picked {userAnswer},{" "}
          {userAnswerCount === 1
            ? `it’s the first time this word has been chosen out of
            ${totalPicks}
             picks`
            : `this word has been chosen 
            ${userAnswerCount} 
            times out of
            ${totalPicks} 
            picks`}
        </h1>
      ) : (
        <h1 className="mb-4 text-xl">
          there has been {totalPicks} total picks
        </h1>
      )}
      <div>
        <h2 className="text-left text-start mt-12 font-mono">
          the picked words are
        </h2>
      </div>
      <div className="mt-4 flex flex-row gap-3 w-full flex-wrap ">
        {/* Print out all the words in white with font-nanum */}
        {allAnswers.map((word: string, index: number) => (
          <p
            key={index}
            className={`${word === userAnswer ? "text-black" : "text-white"} ${
              nanumMyeongjo.className
            } text-2xl`}
          >
            {word}
          </p>
        ))}
      </div>
    </div>
  );
}
