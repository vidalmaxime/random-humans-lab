import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import Image from "next/image";

import Heatmap from "./Heatmap";

export default function VizResults() {
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
        heatmap of all {positions.length} clicks
      </p>
      <div className="text-black flex flex-col items-center w-full h-full mt-2">
        <Heatmap
          data={positions}
          userPosition={userPosition}
          baseRadius={200}
        />
      </div>
      <motion.div
        className="mt-2 cursor-pointer flex flex-row items-center opacity-70 mt-8 md:mt-4"
        onClick={toggleCollapse}
        whileHover={{ opacity: 1 }}
      >
        <h2 className="text-lg text-white">
          click here for other data visualizations
        </h2>
        <div className="ml-2" ref={scope}>
          <Image src="/chevron-down.svg" alt="chevron" width={16} height={16} />
        </div>
      </motion.div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className={"flex flex-col items-center w-full mt-8"}
            initial={{ y: -70 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-2 w-full pb-8">
              <div className="w-1/3 h-96">
                mobile clicks
                <Heatmap data={mobilePositions} baseRadius={200} />
              </div>
              <div className="w-full h-96">
                desktop clicks
                <Heatmap data={desktopPositions} baseRadius={200} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
