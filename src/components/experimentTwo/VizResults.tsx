import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import Image from "next/image";

import Heatmap from "./Heatmap";
import ClickDensityPlot from "./ClickDensityPlot";

export default function VizResults(userDeviceType: string) {
  const [userPosition, setUserPosition] = useState({
    x: 0,
    y: 0,
  });
  const [positions, setPositions] = useState([]);
  const [mobilePositions, setMobilePositions] = useState<any[]>([]);
  const [desktopPositions, setDesktopPositions] = useState<any[]>([]);
  const parentRef = useRef(null);
  const [scope, animate] = useAnimate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Filter positions to only include mobile or desktop
  const filterPositions = (positions: any[], deviceType: string) => {
    return positions.filter((position) => position.deviceType === deviceType);
  };

  const toggleCollapse = () => {
    animate(
      scope.current,
      { rotate: isCollapsed ? [0, 60] : [60, 0] },
      { duration: 0.3 }
    );
    setIsCollapsed(!isCollapsed);
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
            setPositions(positions);
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
      <p className="flex items-left text-left w-full">
        Density function of all {positions.length} clicks
      </p>
      <div className="text-black flex flex-col items-center w-full h-full mt-2">
        <ClickDensityPlot
          data={userDeviceType == "mobile" ? mobilePositions : desktopPositions}
          userDeviceType={userDeviceType}
        />
      </div>
    </div>
  );
}
