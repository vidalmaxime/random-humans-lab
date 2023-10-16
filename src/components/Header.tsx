import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Header({ title }: { title: string }) {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    // Generate random colors upon component mount
    const generatedColors = title
      .split(" ")
      .map(() => (Math.random() < 0.5 ? "black" : "accent"));
    setColors(generatedColors);
    console.log(generatedColors);
  }, [title]);

  return (
    <div className="flex w-full">
      <Head>
        {title ? <title>{title}</title> : <title>random humans lab</title>}
      </Head>
      <motion.div
        whileHover={{
          scale: 1,
          rotate: 90,
        }}
      >
        <Link href="/">
          <Image
            src="/rhl-logo.svg"
            alt="Random Humans Lab Logo"
            width={100}
            height={100}
          />
        </Link>
      </motion.div>
      <h1 className="text-3xl md:text-5xl ml-8 w-1/3 md:w-2/3">
        {title.split(" ").map((word, index) => (
          <span
            key={index}
            style={{
              color: colors[index] === "accent" ? "#e11d48" : "#111827", // using hex codes
              transition: "ease-in 300ms",
            }}
          >
            {word}{" "}
          </span>
        ))}
      </h1>
    </div>
  );
}
