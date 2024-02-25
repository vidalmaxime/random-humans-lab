import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

import { haasgrotdisp } from "@/styles/fonts";

export default function VizResults() {
  const [userAnswer, setUserAnswer] = useState(-1);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [allAnswers, setAllAnswers] = useState<number[]>([]);
  const [totalPicks, setTotalPicks] = useState(0);

  useEffect(() => {
    // We chain retrieving of user answer and general data
    setAudioContext(new AudioContext());
    const user = auth.currentUser;
    if (user) {
      const userdocRef = doc(db, "experiment_6", user.uid);
      getDoc(userdocRef).then((userDoc) => {
        let tmpUserAnswer = -1;
        if (userDoc.exists()) {
          tmpUserAnswer = userDoc.data().answer;
          setUserAnswer(tmpUserAnswer);
        }
        const docRef = doc(db, "experiment_6", "general");
        getDoc(docRef).then((doc) => {
          if (doc.exists()) {
            const frequencies = doc.data().answers;
            setAllAnswers(frequencies);
            setTotalPicks(frequencies.length);
          }
        });
      });
    }
  }, []);

  const noteStrings = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  // modified from https://github.com/cwilso/PitchDetect/blob/main/js/pitchdetect.js
  const noteFromPitch = (frequency: number) => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const noteIndex = Math.round(noteNum) + 69;
    return noteStrings[noteIndex % 12];
  };

  const frequencyFromNoteNumber = (note: number) => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };

  // modified from https://github.com/cwilso/PitchDetect/tree/main
  const VOLUME_CURVE = [1.0, 0.61, 0.37, 0.22, 0.14, 0.08, 0.05, 0.0];
  const playSingleFrequency = (frequency: number) => {
    if (!audioContext) {
      return;
    }
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const duration = 1.5;
    oscillator.connect(gain);
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.connect(audioContext.destination);
    oscillator.start(0);

    gain.gain.setValueCurveAtTime(
      VOLUME_CURVE,
      audioContext.currentTime,
      duration
    );
  };

  // const centsOffFromPitch = (frequency: number, note: number) => {
  //   return Math.floor(
  //     (1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2)
  //   );
  // };

  return (
    <div className="text-black flex flex-col items-start w-full mb-32">
      <div className="text-black flex flex-col items-center w-full mb-4">
        {userAnswer !== -1 ? (
          <h1 className={`mb-4 text-3xl md:text-6xl ${haasgrotdisp.className}`}>
            You emitted a {userAnswer} Hz ({noteFromPitch(userAnswer)}){" "}
            <span
              className="bg-black text-white rounded-lg px-4 py-1 cursor-pointer select-none"
              onClick={() => {
                playSingleFrequency(userAnswer);
              }}
            >
              sound
            </span>
            . Your sound has been heard, among {totalPicks} voices.
          </h1>
        ) : (
          <h1 className={`mb-4 text-3xl md:text-6xl ${haasgrotdisp.className}`}>
            There has been {totalPicks} total picks
          </h1>
        )}
      </div>

      <div>
        <h2 className="text-start mt-1 font-mono">The sounds made are</h2>
      </div>
      <div className="mt-4 flex flex-row gap-3 w-full flex-wrap ">
        {/* Print out all the words in white with font-nanum */}
        {allAnswers.map((frequency: number, index: number) => (
          <p
            key={index}
            className={`rounded-md  cursor-pointer text-white px-2 py-1 select-none ${
              frequency === userAnswer ? "bg-[#e11d48]" : "bg-black"
            }`}
            onClick={() => {
              playSingleFrequency(frequency);
            }}
          >
            {frequency} Hz ({noteFromPitch(frequency)})
          </p>
        ))}
      </div>
    </div>
  );
}
