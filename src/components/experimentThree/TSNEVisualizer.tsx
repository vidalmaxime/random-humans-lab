"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as druid from "@saehrimnir/druidjs";
import * as tf from "@tensorflow/tfjs";

// Define prop types
interface TSNEVisualizerProps {
  model: any;
  allAnswers: any[];
  userAnswer: string;
}

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div>Loading Plot...</div>,
});

const TSNEVisualizer: React.FC<TSNEVisualizerProps> = ({
  model,
  allAnswers,
  userAnswer,
}) => {
  const [projectionData, setProjectionData] = useState<number[][]>([]);
  const [screenWidth, setScreenWidth] = useState<number>(0); // Initialize with 0, then update after mount
  const [loadingEmbeddings, setLoadingEmbeddings] = useState<boolean>(false);

  useEffect(() => {
    setScreenWidth(window.innerWidth); // Set screenWidth only after the component has mounted

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const layout = {
    width: screenWidth < 768 ? 600 : 1000, // Smaller width for mobile screens
    height: screenWidth < 768 ? 400 : 700, // Smaller height for mobile screens
    title: "",
    paper_bgcolor: "rgba(0,0,0,0)", // transparent background
    plot_bgcolor: "rgba(0,0,0,0)", // transparent background
    xaxis: {
      showgrid: false, // remove the x-axis grid
      zeroline: false, // remove the thick zero line
      showline: false, // remove the x-axis line
      showticklabels: false, // remove the x-axis labels
    },
    yaxis: {
      showgrid: false, // remove the y-axis grid
      zeroline: false, // remove the thick zero line
      showline: false, // remove the y-axis line
      showticklabels: false, // remove the y-axis labels
    },
  };

  const config = {
    displayModeBar: false, // remove configuration options
  };

  async function encodeWords() {
    if (model) {
      setLoadingEmbeddings(true);
      model.embed(allAnswers).then(async (embeddings: tf.Tensor) => {
        setLoadingEmbeddings(false);
        let generator = new druid.TSNE(embeddings.arraySync()).generator();
        for (const Y of generator) {
          setProjectionData(Y);
          await new Promise((resolve) => setTimeout(resolve, 100)); // delay of 100ms
        }
      });
    }
  }

  const scatterData = {
    x: projectionData.map((p) => p[0]),
    y: projectionData.map((p) => p[1]),
    mode: "markers",
    type: "scatter",
    text: allAnswers,
    marker: {
      color: allAnswers.map((answer) =>
        answer === userAnswer ? "#e11d48" : "black"
      ), // color points based on the user's answer
    },
    hoverinfo: "text",
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {loadingEmbeddings && <p>Embeddings are loading...</p>}
      {!loadingEmbeddings && projectionData.length === 0 && (
        <button
          className="bg-gray-700 hover:bg-gray-900 text-white mb-4 py-2 px-4 rounded-md"
          onClick={encodeWords}
        >
          Compute tSNE embeddings
        </button>
      )}

      {projectionData.length > 0 && (
        <Plot data={[scatterData as any]} layout={layout} config={config} />
      )}
    </div>
  );
};

export default TSNEVisualizer;
