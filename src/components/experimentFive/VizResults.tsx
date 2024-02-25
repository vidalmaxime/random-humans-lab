import React, { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

interface Point {
  x: number;
  y: number;
}

export default function VizResults() {
  const [userStrokes, setUserStrokes] = useState<Point[][]>([]);
  const [allStrokes, setAllStrokes] = useState<Point[][][]>([]);
  const userCanvasRef = useRef<HTMLCanvasElement>(null);
  const allCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "experiment_5", user.uid);
      getDoc(userDocRef).then((userDoc) => {
        if (userDoc.exists()) {
          const tmpUserStrokesObject = userDoc.data().strokes;
          const strokesArray: Point[][] = Object.values(
            tmpUserStrokesObject as Point[][]
          ).map((stroke) =>
            stroke.map((point) => ({ x: point.x * 0.333, y: point.y * 0.333 }))
          );
          setUserStrokes(strokesArray);
        }
      });
      const generalDocRef = doc(db, "experiment_5", "general");
      getDoc(generalDocRef).then((doc) => {
        if (doc.exists()) {
          let tmpAllStrokes = doc.data().allStrokes;
          for (let i = 0; i < tmpAllStrokes.length; i++) {
            const tmpAllStrokesObject = tmpAllStrokes[i];
            const strokesArray: Point[][] = Object.values(
              tmpAllStrokesObject as Point[][]
            ).map((stroke) =>
              stroke.map((point) => ({
                x: point.x * 0.333,
                y: point.y * 0.333,
              }))
            );
            tmpAllStrokes[i] = strokesArray;
          }
          setAllStrokes(tmpAllStrokes);
        }
      });
    }
  }, []);

  const drawStroke = (
    ctx: CanvasRenderingContext2D,
    stroke: Point[],
    strokeIndex: number = 0
  ) => {
    if (strokeIndex >= stroke.length - 1) {
      return;
    }

    const point = stroke[strokeIndex];
    const nextPoint = stroke[strokeIndex + 1];

    ctx.lineWidth = 3.2; // Adjusted line width
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    setTimeout(() => {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.stroke();

      drawStroke(ctx, stroke, strokeIndex + 1);
    }, 7);
  };

  const replayDrawing = (
    strokes: Point[][],
    canvasRef: React.RefObject<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || strokes.length === 0) return;

    if (canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawNextStroke = (index: number) => {
        if (index >= strokes.length) return;

        drawStroke(ctx, strokes[index], 0);

        setTimeout(() => {
          drawNextStroke(index + 1);
        }, strokes[index].length * 4 + 200);
      };

      drawNextStroke(0);
    }
  };

  useEffect(() => {
    if (userStrokes.length > 0) {
      replayDrawing(userStrokes, userCanvasRef);
    }
    allStrokes.forEach((strokes, index) => {
      if (allCanvasRefs.current[index]) {
        replayDrawing(strokes, { current: allCanvasRefs.current[index] });
      }
    });
  }, [userStrokes, allStrokes]);

  return (
    <div className="text-black flex flex-col items-start w-full mb-32">
      <div className="text-black flex flex-col items-center w-full mb-4">
        {userStrokes.length > 0 && (
          <h1 className="flex items-center mb-4 text-3xl md:text-6xl">
            You drew
            <canvas
              width="100" // Adjusted size
              height="100" // Adjusted size
              // className="bg-white"
              ref={userCanvasRef}
            ></canvas>
          </h1>
        )}
      </div>
      <div>
        <h2 className="mt-1 font-mono">Other people drew</h2>
      </div>
      <div className="mt-4 flex flex-row gap-3 w-full flex-wrap">
        {allStrokes.map((_, index) => (
          <canvas
            width="100" // Adjusted size
            height="100" // Adjusted size
            // className="bg-white"
            key={index}
            ref={(el) => (allCanvasRefs.current[index] = el)}
          ></canvas>
        ))}
      </div>
    </div>
  );
}
