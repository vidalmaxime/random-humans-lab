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
      canvas.width = parseInt(width) * ratio;
      canvas.height = parseInt(height) * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(ratio, ratio);

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 9.6;
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

  // Add touch event listeners to the canvas for mobile support
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent the default touch behavior like scrolling
    const touch = e.touches[0];
    const { offsetX, offsetY } = getTouchPos(canvasRef.current, touch);
    setIsDrawing(true);
    setPoints((prevPoints) => [...prevPoints, { x: offsetX, y: offsetY }]);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent the default touch behavior like scrolling
    if (!isDrawing) return;
    const touch = e.touches[0];
    const { offsetX, offsetY } = getTouchPos(canvasRef.current, touch);
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
    }
  };

  // Helper function to get touch position relative to the canvas
  const getTouchPos = (
    canvasDom: HTMLCanvasElement | null,
    touchEvent: React.Touch
  ) => {
    var rect = canvasDom?.getBoundingClientRect();
    return {
      offsetX: touchEvent.clientX - (rect?.left ?? 0),
      offsetY: touchEvent.clientY - (rect?.top ?? 0),
    };
  };

  return (
    <div className="flex w-full h-full justify-center items-center align-center ">
      <div className="flex-col">
        <div className="flex justify-end">
          <button
            className=" bg-gray-400 text-white rounded-md p-2 ml-2 my-2"
            onClick={resetCanvas}
          >
            ERASE
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width="300"
          height="300"
          className="border-2 bg-white border-gray-300 rounded-lg"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawingTouch}
          onTouchMove={drawTouch}
          onTouchEnd={stopDrawing}
        />
        <div className="flex justify-center">
          <motion.button
            className={` bg-black text-white rounded-md p-2 ml-2 my-2 ${haasgrotdisp.className}`}
            onClick={handleSubmit}
            whileHover={{
              scale: 1.1,
            }}
          >
            SUBMIT
          </motion.button>
        </div>
      </div>
    </div>
  );
}

type VizQuestionProps = {
  send: (strokes: Point[][]) => void;
};
