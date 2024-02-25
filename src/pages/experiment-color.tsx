import React, { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "../../firebase";

import VizQuestion from "@/components/experimentFour/VizQuestion";
import VizResults from "@/components/experimentFour/VizResults";
import Header from "@/components/Header";

export default function Experiment4() {
  const [userAlreadyAnswered, setUserAlreadyAnswered] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(true);

  const checkIfUserAlreadyAnswered = async () => {
    const user = await signInAnonymously(auth);
    if (user) {
      const docRef = doc(db, "experiment_4", user.user.uid);
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
      unsubscribe = onSnapshot(doc(db, "experiment_4", user.uid), (doc) => {
        if (doc.exists()) {
          setUserAlreadyAnswered(true);
        }
      });
    } else {
      signInAnonymously(auth).then((user) => {
        unsubscribe = onSnapshot(
          doc(db, "experiment_4", user.user.uid),
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

  async function sendAnswer(color: string) {
    const user = auth.currentUser;
    if (user) {
      // Add to general doc containing array of all answers using arrayUnion
      const generalDocRef = doc(db, "experiment_4", "general");
      const document = await getDoc(generalDocRef);

      if (document.exists()) {
        // Update both answers and numberFactors by storing a temp array
        const tempAnswers = document.data()?.answers;
        tempAnswers.push(color);
        await updateDoc(generalDocRef, {
          answers: tempAnswers,
        });
      } else {
        await setDoc(generalDocRef, {
          answers: [color],
        });
      }
      // Create doc with user uid
      const docRef = doc(db, "experiment_4", user.uid);
      setDoc(docRef, { answer: color });
      setUserAlreadyAnswered(true);
    }
  }

  return (
    <main className={`flex min-h-screen flex-col items-center p-4`}>
      <Header title={"select a color"} />

      {!loadingVerification && (
        <div className="mt-16 w-full">
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
