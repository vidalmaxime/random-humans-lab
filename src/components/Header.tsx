import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Header({ title }: { title: string }) {
  return (
    <div className="flex w-full">
      <Head>
        {title ? <title>{title}</title> : <title>random humans lab</title>}
      </Head>
      <motion.div
        whileHover={{
          scale: 1.1,
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
            className={`text-${
              Math.random() < 0.5 ? "white" : "black"
            } bg-gradient-to-r ${
              Math.random() < 0.5
                ? "from-black to-white"
                : "from-white to-black"
            } bg-clip-text`}
          >
            {word}{" "}
          </span>
        ))}
      </h1>
    </div>
  );
}
