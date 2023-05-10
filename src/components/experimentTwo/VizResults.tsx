import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../../../firebase";
import Heatmap from "./Heatmap";

export default function VizResults() {
  const [userPositions, setUserPositions] = useState({ x: 0, y: 0 });
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // We chain retrieving of user answer and general data
    const user = auth.currentUser;
    if (user) {
      const userdocRef = doc(db, "experiment_2", user.uid);
      getDoc(userdocRef).then((userDoc) => {
        if (userDoc.exists()) {
          setUserPositions({
            x: userDoc.data().x,
            y: userDoc.data().y,
          });
        }
        const docRef = doc(db, "experiment_2", "general");
        getDoc(docRef).then((doc) => {
          if (doc.exists()) {
            const positions = doc.data().positions;
            setPositions(positions);
          }
        });
      });
    }
  }, []);

  return (
    <div className="text-black flex flex-col items-center w-full mb-32">
      <Heatmap
        positions={positions}
        title="General heatmap"
        userPos={userPositions}
      />
    </div>
  );
}
