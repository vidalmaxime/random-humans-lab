import React, { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { auth, db } from "../../firebase";
import Image from "next/image";

import Footer from "@/components/Footer";
import VizQuestion from "@/components/experimentOne/VizQuestion";
import VizResults from "@/components/experimentOne/VizResults";

export default function Experiment1() {
  const [userAlreadyAnswered, setUserAlreadyAnswered] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(true);

  const checkIfUserAlreadyAnswered = async () => {
    const user = await signInAnonymously(auth);
    if (user) {
      const docRef = doc(db, "experiment_1", user.user.uid);
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
    let unsubscribe = () => { };
    const user = auth.currentUser;
    if (user) {
      unsubscribe = onSnapshot(doc(db, "experiment_1", user.uid), (doc) => {
        if (doc.exists()) {
          setUserAlreadyAnswered(true);
        }
      });
    } else {
      signInAnonymously(auth).then((user) => {
        unsubscribe = onSnapshot(
          doc(db, "experiment_1", user.user.uid),
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

  async function sendAnswer(value: number, numberFactors: number) {
    const user = auth.currentUser;
    if (user) {
      // Add to general doc containing array of all answers using arrayUnion
      const generalDocRef = doc(db, "experiment_1", "general");
      const document = await getDoc(generalDocRef);

      if (document.exists()) {
        // Update both answers and numberFactors by storing a temp array
        const tempAnswers = document.data()?.answers;
        tempAnswers.push(value);
        const tempNumberFactors = document.data()?.numberFactors;
        tempNumberFactors.push(numberFactors);
        await updateDoc(generalDocRef, {
          answers: tempAnswers,
          numberFactors: tempNumberFactors,
        });
      } else {
        await setDoc(generalDocRef, {
          answers: [value],
          numberFactors: [numberFactors],
        });
      }
      // Create doc with user uid
      const docRef = doc(db, "experiment_1", user.uid);
      setDoc(docRef, { answer: value, numberFactors: numberFactors });
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-4 bg-green-100`}
    >
      <div className="flex items-center justify-center">
        <div className="mr-16">
          <Image
            src="/rhl-logo.svg"
            alt="Random Humans Lab Logo"
            width={100}
            height={100}
          />
        </div>

        <h1 className="text text-6xl text-black">
          Pick a number between 0 and infinity
        </h1>
      </div>

      {!loadingVerification && (
        <div className="mt-16">
          {userAlreadyAnswered ? (
            <VizResults />
          ) : (
            <VizQuestion send={sendAnswer} />
          )}
        </div>
      )}

      <Footer />
    </main>
  );
}
