import React, { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "../../firebase";

import VizQuestion from "@/components/experimentTwo/VizQuestion";
import VizResults from "@/components/experimentTwo/VizResults";
import Header from "@/components/Header";

export default function Experiment1() {
  const [userAlreadyAnswered, setUserAlreadyAnswered] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(true);

  const checkIfUserAlreadyAnswered = async () => {
    const user = await signInAnonymously(auth);
    if (user) {
      const docRef = doc(db, "experiment_2", user.user.uid);
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
      unsubscribe = onSnapshot(doc(db, "experiment_2", user.uid), (doc) => {
        if (doc.exists()) {
          setUserAlreadyAnswered(true);
        }
      });
    } else {
      signInAnonymously(auth).then((user) => {
        unsubscribe = onSnapshot(
          doc(db, "experiment_2", user.user.uid),
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

  async function sendAnswer(
    x: number,
    y: number,
    clientWidth: number,
    clientHeight: number
  ) {
    const user = auth.currentUser;
    if (user) {
      // Add to general doc containing array of all answers using arrayUnion
      const generalDocRef = doc(db, "experiment_2", "general");
      const document = await getDoc(generalDocRef);

      if (document.exists()) {
        const tempPositions = document.data()?.positions;
        tempPositions.push({
          x: x,
          y: y,
          clientWidth: clientWidth,
          clientHeight: clientHeight,
        });

        await updateDoc(generalDocRef, {
          positions: tempPositions,
        });
      } else {
        await setDoc(generalDocRef, {
          positions: [
            {
              x: x,
              y: y,
              clientWidth: clientWidth,
              clientHeight: clientHeight,
            },
          ],
        });
      }
      // Create doc with user uid
      const docRef = doc(db, "experiment_2", user.uid);
      setDoc(docRef, {
        x: x,
        y: y,
        clientWidth: clientWidth,
        clientHeight: clientHeight,
      });
    }
  }

  return (
    <main className={`flex h-screen flex-col items-center p-4`}>
      <Header title={"click somewhere below"} />

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
