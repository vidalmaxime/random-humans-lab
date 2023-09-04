import React, { useState } from "react";
import SkewLoader from "react-spinners/SkewLoader";

export default function VizQuestion({ send }: VizQuestionProps) {
  const [justClicked, setJustClicked] = useState(false);

  return (
    <div className="flex justify-center flex-col items-center w-full h-full">
      {!justClicked ? (
        <div
          className="w-screen h-full cursor-pointer "
          onClick={(e) => {
            // Get the offset of the click relative to the svg rectangle on a scale of 0 to 1
            setJustClicked(true);
            const x = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
            const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight;
            const userAgent = window.navigator.userAgent;
            console.log(userAgent);
            let deviceType = "computer";
            if (/Mobi|Android/i.test(userAgent)) {
              deviceType = "mobile";
            }

            send(
              x,
              y,
              e.currentTarget.clientWidth,
              e.currentTarget.clientHeight,
              deviceType
            );
          }}
        ></div>
      ) : (
        <div>
          <SkewLoader color="black" speedMultiplier={0.5} />
        </div>
      )}
    </div>
  );
}

type VizQuestionProps = {
  send: (
    x: number,
    y: number,
    clientWidth: number,
    clientHeight: number,
    deviceType: string
  ) => void;
};
