"use client";
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import * as druid from "@saehrimnir/druidjs";
import * as tf from "@tensorflow/tfjs";

// Define prop types
interface TSNEVisualizerProps {
  model: any; // Adjust this type based on your model's type definition
  allAnswers: any[]; // Adjust this type based on the structure of your answers
}

const TSNEVisualizer: React.FC<TSNEVisualizerProps> = ({
  model,
  allAnswers,
}) => {
  const [projectionData, setProjectionData] = useState<number[][]>([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
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
      model.embed(allAnswers).then(async (embeddings: tf.Tensor) => {
        console.log(embeddings.arraySync());
        let generator = new druid.TSNE(embeddings.arraySync()).generator();

        for (const Y of generator) {
          console.log(Y);
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
      color: "black", // setting scatter point color to black
    },
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <button onClick={encodeWords}>
        Compute the tSNE of the word embeddings
      </button>
      {projectionData.length > 0 && (
        <Plot data={[scatterData as any]} layout={layout} config={config} />
      )}
    </div>
  );
};

export default TSNEVisualizer;
