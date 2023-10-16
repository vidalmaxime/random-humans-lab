import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

import ClickDensityPlot from "./ClickDensityPlot";

type VizResultsProps = {
  userDeviceType: string;
};

export default function VizResults({ userDeviceType }: VizResultsProps) {
  const [userPosition, setUserPosition] = useState({
    x: 0,
    y: 0,
  });
  const [mobilePositions, setMobilePositions] = useState<any[]>([]);
  const [desktopPositions, setDesktopPositions] = useState<any[]>([]);
  const parentRef = useRef(null);

  // Filter positions to only include mobile or desktop
  const filterPositions = (positions: any[], deviceType: string) => {
    return positions.filter((position) => position.deviceType === deviceType);
  };

  useEffect(() => {
    // We chain retrieving of user answer and general data
    const user = auth.currentUser;

    if (user) {
      const userdocRef = doc(db, "experiment_2", user.uid);
      getDoc(userdocRef).then((userDoc) => {
        if (userDoc.exists()) {
          setUserPosition({
            x: userDoc.data().x,
            y: userDoc.data().y,
          });
        }
        const docRef = doc(db, "experiment_2", "general");
        getDoc(docRef).then((doc) => {
          if (doc.exists()) {
            const positions = doc.data().positions;
            setMobilePositions(filterPositions(positions, "mobile"));
            setDesktopPositions(filterPositions(positions, "computer"));
          }
        });
      });
    }
  }, []);

  return (
    <div
      className="text-black flex flex-col items-center w-full h-5/6  md:mt-6"
      ref={parentRef}
    >
      <p className="flex items-center text-center justify-center w-full mb-8">
        Density function of all{" "}
        {userDeviceType == "mobile"
          ? mobilePositions.length
          : desktopPositions.length}{" "}
        {userDeviceType == "mobile" ? "phone" : "large screen"} clicks
      </p>
      <div className="text-black flex flex-col items-center w-full h-full mt-2">
        <ClickDensityPlot
          data={
            userDeviceType === "mobile" ? mobilePositions : desktopPositions
          }
          userDeviceType={userDeviceType}
          userPosition={userPosition}
        />
      </div>
    </div>
  );
}
