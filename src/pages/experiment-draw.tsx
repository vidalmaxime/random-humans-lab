import React, { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "../../firebase";

import VizQuestion from "@/components/experimentFive/VizQuestion";
import VizResults from "@/components/experimentFive/VizResults";
import Header from "@/components/Header";

interface Point {
  x: number;
  y: number;
}

export default function Experiment5() {
  const [userAlreadyAnswered, setUserAlreadyAnswered] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(true);

  const checkIfUserAlreadyAnswered = async () => {
    const user = await signInAnonymously(auth);
    if (user) {
      const docRef = doc(db, "experiment_5", user.user.uid);
      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          setUserAlreadyAnswered(true);
        }
        setLoadingVerification(false);
      });
    }
  };

  // Check if user already answered
  useEffect(() => {
    checkIfUserAlreadyAnswered();
  }, []);

  // Set the listener for answer existence
  useEffect(() => {
    let unsubscribe = () => {};
    const user = auth.currentUser;
    if (user) {
      unsubscribe = onSnapshot(doc(db, "experiment_5", user.uid), (doc) => {
        if (doc.exists()) {
          setUserAlreadyAnswered(true);
        }
      });
    } else {
      signInAnonymously(auth).then((user) => {
        unsubscribe = onSnapshot(
          doc(db, "experiment_5", user.user.uid),
          (doc) => {
            if (doc.exists()) {
              setUserAlreadyAnswered(true);
            }
          }
        );
      });
    }
    return () => {
      unsubscribe();
    };
  }, []);

  async function sendAnswer(strokes: Point[][]) {
    const user = auth.currentUser;
    if (user) {
      const serializedStrokes = strokes.reduce((acc, currentStroke, index) => {
        // Using index + 1 to start keys at 1 instead of 0
        acc[index + 1] = currentStroke;
        return acc;
      }, {} as { [key: number]: Point[] });
      // Add to general doc containing array of all answers using arrayUnion
      const generalDocRef = doc(db, "experiment_5", "general");
      const document = await getDoc(generalDocRef);

      if (document.exists()) {
        const tmpStrokes = document.data()?.allStrokes;
        tmpStrokes.push(serializedStrokes);

        await updateDoc(generalDocRef, {
          allStrokes: tmpStrokes,
        });
      } else {
        await setDoc(generalDocRef, {
          allStrokes: [serializedStrokes],
        });
      }
      // Create doc with user uid
      const docRef = doc(db, "experiment_5", user.uid);
      setDoc(docRef, { strokes: serializedStrokes });
    }
  }

  return (
    <main className={`flex h-screen flex-col items-center p-4`}>
      <Header title={"draw something"} />

      {!loadingVerification && (
        <div className="mt-8 md:mt-0 w-full h-full">
          {userAlreadyAnswered ? (
            <VizResults />
          ) : (
            <VizQuestion send={sendAnswer} />
          )}
        </div>
      )}
    </main>
  );
}
