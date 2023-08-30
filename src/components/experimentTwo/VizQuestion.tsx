import React from "react";

export default function VizQuestion({ send }: VizQuestionProps) {
  return (
    <div className="flex justify-center flex-col items-center w-full h-full">
      <div
        className="w-screen h-full cursor-pointer "
        onClick={(e) => {
          // Get the offset of the click relative to the svg rectangle on a scale of 0 to 1
          const x = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
          const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight;
          const userAgent = window.navigator.userAgent;
          console.log(userAgent);
          let deviceType = "computer";
          if (/Mobi|Android/i.test(userAgent)) {
            deviceType = "mobile";
          }
          console.log(deviceType);

          send(
            x,
            y,
            e.currentTarget.clientWidth,
            e.currentTarget.clientHeight,
            deviceType
          );
        }}
      ></div>
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
