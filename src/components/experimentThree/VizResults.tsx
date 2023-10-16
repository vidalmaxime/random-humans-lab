import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

require("@tensorflow/tfjs");
import { UniversalSentenceEncoder } from "@tensorflow-models/universal-sentence-encoder";
import * as use from "@tensorflow-models/universal-sentence-encoder";

import TSNEVisualizer from "./TSNEVisualizer";
import { nanumMyeongjo } from "@/styles/fonts";
import { haasgrotdisp } from "@/styles/fonts";

export default function VizResults() {
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswerCount, setUserAnswerCount] = useState(0);
  const [allAnswers, setAllAnswers] = useState<any>([]);
  const [totalPicks, setTotalPicks] = useState(0);
  const [selectedWord, setSelectedWord] = useState("");
  const [projectionData, setProjectionData] = useState<number[][]>([]);

  const [model, setModel] = useState<null | UniversalSentenceEncoder>(null);

  useEffect(() => {
    async function loadModel() {
      const loadedModel = await use.load();
      setModel(loadedModel);
    }

    loadModel();
  }, []);

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
    <div className="text-black flex flex-col items-start w-full mb-32">
      <div className="text-black flex flex-col items-center w-full mb-4">
        {userAnswer !== "" ? (
          <h1 className={`mb-4 text-3xl md:text-6xl ${haasgrotdisp.className}`}>
            You picked {userAnswer},{" "}
            {userAnswerCount === 0
              ? `it’s the first time this word has been chosen out of
            ${totalPicks}
             picks`
              : `this word has been chosen 
            ${userAnswerCount} 
            times out of
            ${totalPicks} 
            other picks`}
          </h1>
        ) : (
          <h1 className={`mb-4 text-3xl md:text-6xl ${haasgrotdisp.className}`}>
            There has been {totalPicks} total picks
          </h1>
        )}
      </div>
      {!model ? (
        <div className="w-full flex flex-col justify-center items-center pb-8">
          Embedding model is loading...
        </div>
      ) : (
        <div className="w-full">
          <TSNEVisualizer
            model={model}
            allAnswers={allAnswers}
            userAnswer={userAnswer}
            selectedWord={selectedWord}
            projectionData={projectionData}
            setProjectionData={setProjectionData}
          />
        </div>
      )}
      <div>
        <h2 className="text-left text-start mt-1 font-mono">
          The picked words are
        </h2>
      </div>
      <div className="mt-4 flex flex-row gap-3 w-full flex-wrap ">
        {/* Print out all the words in white with font-nanum */}
        {allAnswers.map((word: string, index: number) => (
          <p
            key={index}
            onClick={() => {
              if (projectionData && projectionData.length > 0) {
                setSelectedWord(word);
                document.getElementById("tsneVisualizer")?.scrollIntoView();
              }
            }}
            className={`${
              word === userAnswer
                ? "text-rose-600"
                : word === selectedWord
                ? "text-green-600"
                : "text-gray-700"
            } ${nanumMyeongjo.className} text-xl md:text-2xl`}
            style={{
              cursor:
                projectionData && projectionData.length > 0
                  ? "pointer"
                  : "default",
            }}
          >
            {word}
          </p>
        ))}
      </div>
    </div>
  );
}
