import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

import { haasgrotdisp } from "@/styles/fonts";

export default function VizResults() {
  const [userAnswer, setUserAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState<any>([]);
  const [totalPicks, setTotalPicks] = useState(0);
  const [selectedWord, setSelectedWord] = useState("");

  useEffect(() => {
    // We chain retrieving of user answer and general data
    const user = auth.currentUser;
    if (user) {
      const userdocRef = doc(db, "experiment_4", user.uid);
      getDoc(userdocRef).then((userDoc) => {
        let tmpUserAnswer = "";
        if (userDoc.exists()) {
          tmpUserAnswer = userDoc.data().answer;
          setUserAnswer(tmpUserAnswer);
        }
        const docRef = doc(db, "experiment_4", "general");
        getDoc(docRef).then((doc) => {
          if (doc.exists()) {
            const colors = doc.data().answers;
            setAllAnswers(colors);
            setTotalPicks(colors.length);
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
            You picked{" "}
            {
              <span
                className={`w-8 px-7  h-8 rounded-md`}
                style={{ backgroundColor: userAnswer }}
              ></span>
            }
            , a beautiful color among {totalPicks} picks
          </h1>
        ) : (
          <h1 className={`mb-4 text-3xl md:text-6xl ${haasgrotdisp.className}`}>
            There has been {totalPicks} total picks
          </h1>
        )}
      </div>

      <div>
        <h2 className="text-left text-start mt-1 font-mono">
          The selected colors are
        </h2>
      </div>
      <div className="mt-4 flex flex-row gap-3 w-full flex-wrap ">
        {/* Print out all the words in white with font-nanum */}
        {allAnswers.map((color: string, index: number) => (
          <p
            key={index}
            className="w-8 h-8 rounded-md"
            style={{ backgroundColor: color }}
          ></p>
        ))}
      </div>
    </div>
  );
}
