import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../../../firebase";

export default function VizResults() {
  const [userAnswer, setUserAnswer] = useState("");

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

  return (
    <div className="text-black">
      <h1>Here are the results</h1> <p>your answer</p> <p>{userAnswer}</p>
    </div>
  );
}
