import React, { useEffect, useRef, useState } from "react";

type HeatmapData = {
  x: number;
  y: number;
}[];

type HeatmapProps = {
  data: HeatmapData;
  userPosition?: { x: number; y: number };
  baseRadius: number;
};

const Heatmap: React.FC<HeatmapProps> = ({
  data,
  userPosition = { x: null, y: null },
  baseRadius,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getDynamicRadius = (baseRadius: number, dataLength: number) => {
    const factor = 0.005;
    const dynamicRadius = baseRadius / (1 + factor * dataLength);
    return dynamicRadius;
  };

  useEffect(() => {
    renderCanvas();
  }, [data, baseRadius, userPosition]);

  useEffect(() => {
    const handleResize = () => {
      renderCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, baseRadius, userPosition]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const pixelRatio = window.devicePixelRatio || 1;
        // Adjust the canvas dimensions for the pixel ratio
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        // Scale the drawing context
        ctx.scale(pixelRatio, pixelRatio);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let radius = getDynamicRadius(baseRadius, data.length);

        radius *=
          Math.sqrt(
            canvas.width * canvas.width + canvas.height * canvas.height
          ) * 0.0004;

        radius = Math.max(40, radius);

        data.forEach((point) => {
          const x = point.x * width;
          const y = point.y * height;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, "rgba(255, 0, 0, 0.4)");
          gradient.addColorStop(1, "rgba(0, 0, 255, 0.01)");
          gradient.addColorStop(1, "rgba(0, 0, 255, 0.1)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fill();
        });

        // Drawing user position image
        if (userPosition.x != null && userPosition.y != null) {
          const imageScale = 0.15 + (0.08 * width) / 1000;
          const userX = userPosition.x * width;
          const userY = userPosition.y * height;

          const userIcon = new Image();

          userIcon.onload = () => {
            ctx.imageSmoothingEnabled = false;
            const scaledWidth = userIcon.width * imageScale;
            const scaledHeight = userIcon.height * imageScale;
            ctx.drawImage(
              userIcon,
              0,
              0,
              userIcon.width,
              userIcon.height,
              userX - scaledWidth / 2,
              userY - scaledHeight / 2,
              scaledWidth,
              scaledHeight
            );
          };
          userIcon.src = "/click-icon.svg";
        }
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-200 w-full h-full"
    ></canvas>
  );
};

export default Heatmap;
