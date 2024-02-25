import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
// import { pipeline, RawImage } from "@xenova/transformers";

import { haasgrotdisp } from "@/styles/fonts";

interface Point {
  x: number;
  y: number;
}

export default function VizQuestion({ send }: VizQuestionProps) {
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  // const [classificationResult, setClassificationResult] = useState<
  //   string | null
  // >(null); // State to hold classification result

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      const ratio = window.devicePixelRatio || 1;
      const width = getComputedStyle(canvas)
        .getPropertyValue("width")
        .slice(0, -2);
      const height = getComputedStyle(canvas)
        .getPropertyValue("height")
        .slice(0, -2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(ratio, ratio);

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 16;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setPoints((prevPoints) => [...prevPoints, { x: offsetX, y: offsetY }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      if (points.length > 0) {
        const lastPoint = points[points.length - 1];
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.closePath();
        ctx.stroke();
      }
      setPoints((prevPoints) => [...prevPoints, { x: offsetX, y: offsetY }]);
      // on mouse up, add the current stroke to the strokes array
    }
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    // Add the current points as a stroke to the strokes array
    setStrokes((prevStrokes) => [...prevStrokes, points]);
    // Reset points for a new stroke
    setPoints([]);
    canvasRef.current?.getContext("2d")?.beginPath();
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
    }
    setPoints([]); // Resets points array
    setStrokes([]); // Resets strokes array
    setSubmitted(false); // Resets submitted state
    // setClassificationResult(null); // Also clear the classification result when canvas is reset
  };

  const drawStroke = (stroke: Point[], strokeIndex: number = 0) => {
    if (strokeIndex >= stroke.length - 1) {
      return; // Exit condition: if the stroke is finished
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const point = stroke[strokeIndex];
    const nextPoint = stroke[strokeIndex + 1];

    setTimeout(() => {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.stroke();

      // Call drawStroke recursively for the next segment
      drawStroke(stroke, strokeIndex + 1);
    }, 7); // Adjust the delay as needed
  };

  const replayDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || strokes.length === 0) return;

    resetCanvas(); // Clear the canvas before replaying

    const drawNextStroke = (index: number) => {
      if (index >= strokes.length) return; // Exit condition: if all strokes have been drawn

      drawStroke(strokes[index], 0); // Draw the stroke starting from the first point

      setTimeout(() => {
        drawNextStroke(index + 1); // Schedule the next stroke after the current one is expected to finish
      }, strokes[index].length * 4 + 200); // Adjust the delay based on the number of points in the stroke
    };

    drawNextStroke(0); // Start drawing from the first stroke
  };

  const handleSubmit = async (e: any) => {
    if (submitted) return;
    e.preventDefault();
    setSubmitted(true);
    // await classifyDrawing();
    send(strokes);
  };

  // const classifyDrawing = async () => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext("2d");
  //   if (ctx && canvas) {
  //     console.log(canvas.width, canvas.height);
  //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //     console.log("imageData", imageData.width);
  //     const data = new Uint8ClampedArray(imageData.data.length / 4);
  //     for (let i = 0; i < data.length; ++i) {
  //       data[i] = imageData.data[i * 4 + 3];
  //     }
  //     const img = new RawImage(data, imageData.width, imageData.height, 1);
  //     const image = await img.resize(28, 28, { resample: "lanczos" });

  //     // image.save("drawing.png");

  //     const pipe = await pipeline(
  //       "image-classification",
  //       "Xenova/quickdraw-mobilevit-small",
  //       { quantized: false }
  //     );
  //     const results = await pipe(image, { topk: 5 });
  //     console.log(results);
  //     if (results && results.length > 0) {
  //       setClassificationResult(results[0].label);
  //     }
  //   }
  // };

  return (
    <div className="flex justify-center flex-col items-center w-full h-full">
      <div className=" bg-white">
        <canvas
          ref={canvasRef}
          width="500"
          height="500"
          className="border-2 border-gray-300"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      <motion.button
        className={`bg-black text-white rounded-md p-2 ml-2 my-2 ${haasgrotdisp.className}`}
        onClick={handleSubmit}
        whileHover={{
          scale: 1.1,
        }}
      >
        SUBMIT
      </motion.button>
      {/* Reset Button */}
      <button
        className="bg-red-500 text-white rounded-md p-2 ml-2 my-2"
        onClick={resetCanvas}
      >
        RESET
      </button>
      <button
        className="bg-blue-500 text-white rounded-md p-2 ml-2 my-2"
        onClick={replayDrawing}
      >
        REPLAY
      </button>
    </div>
  );
}

type VizQuestionProps = {
  send: (strokes: Point[][]) => void;
};
