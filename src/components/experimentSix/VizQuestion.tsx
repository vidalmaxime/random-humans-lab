import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Assuming haasgrotdisp is correctly imported and used here
import { haasgrotdisp } from "@/styles/fonts";

interface VizQuestionProps {
  send: (frequency: number) => void;
}

const VizQuestion: React.FC<VizQuestionProps> = ({ send }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const startAudioContext = async () => {
    let context = audioContext;
    if (!context) {
      context = new AudioContext();
      setAudioContext(context);
    }
    if (context.state === "suspended") {
      await context.resume();
    }
    return context;
  };

  // from https://github.com/cwilso/PitchDetect/blob/main/js/pitchdetect.js
  const autoCorrelate = (buf: Float32Array, sampleRate: number) => {
    // Implements the ACF2+ algorithm
    var SIZE = buf.length;
    var rms = 0;

    for (var i = 0; i < SIZE; i++) {
      var val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01)
      // not enough signal
      return -1;

    var r1 = 0,
      r2 = SIZE - 1,
      thres = 0.2;
    for (var i = 0; i < SIZE / 2; i++)
      if (Math.abs(buf[i]) < thres) {
        r1 = i;
        break;
      }
    for (var i = 1; i < SIZE / 2; i++)
      if (Math.abs(buf[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    var c = new Array(SIZE).fill(0);
    for (var i = 0; i < SIZE; i++)
      for (var j = 0; j < SIZE - i; j++) c[i] = c[i] + buf[j] * buf[j + i];

    var d = 0;
    while (c[d] > c[d + 1]) d++;
    var maxval = -1,
      maxpos = -1;
    for (var i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    var T0 = maxpos;

    var x1 = c[T0 - 1],
      x2 = c[T0],
      x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  // modified from https://github.com/cwilso/PitchDetect/blob/main/js/pitchdetect.js
  const startPitchDetect = async () => {
    const context = await startAudioContext();
    if (!context) return;

    let sendCalled = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });

      const mediaStreamSource = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      mediaStreamSource.connect(analyser);

      // Add logic to process the audio data and set the frequency state, reading the analyser data and using autoCorrelate function
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);

      let frequencyHistory: number[] = []; // Array to keep track of the last few frequencies
      const historySize = 5; // Number of samples to consider for stability
      const frequencyThreshold = 10; // Frequency variation threshold

      const processAudio = () => {
        if (sendCalled) return;
        analyser.getFloatTimeDomainData(dataArray);
        const frequency = autoCorrelate(dataArray, context.sampleRate);
        // console.log(frequency);
        if (frequency !== -1) {
          frequencyHistory.push(frequency);
          if (frequencyHistory.length > historySize) {
            frequencyHistory.shift(); // Remove the oldest frequency
          }

          // Check if the frequency has stabilized
          if (frequencyHistory.length === historySize) {
            const isStable = frequencyHistory.every(
              (f, i, arr) =>
                i === 0 || Math.abs(f - arr[i - 1]) <= frequencyThreshold
            );

            if (isStable) {
              // stop recording
              stream.getTracks().forEach((track) => track.stop());
              // Send the stable frequency average
              const avgFrequency = Math.round(
                frequencyHistory.reduce((a, b) => a + b, 0) / historySize
              );
              send(avgFrequency);
              sendCalled = true;
            }
          }
        }

        if (!sendCalled) {
          // Continue processing only if send hasn't been called
          requestAnimationFrame(processAudio);
        }
      };
      processAudio();
    } catch (err) {
      alert("Stream generation failed.");
    }
  };

  return (
    <div className="flex justify-center flex-col items-center w-full">
      <div className="flex justify-center flex-wrap items-center w-90 md:w-96 rounded-lg p-16">
        <motion.button
          className={`bg-black text-white rounded-md p-2 ml-2 my-2 ${haasgrotdisp.className}`}
          onClick={startPitchDetect} // Changed to start pitch detection
          whileHover={{
            scale: 1.1,
          }}
        >
          {audioContext ? "LISTENING" : "MAKE A SOUND"}
        </motion.button>
      </div>
    </div>
  );
};

export default VizQuestion;
