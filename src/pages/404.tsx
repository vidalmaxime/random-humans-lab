import React from "react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const Custom404: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href="/">
        <Image
          src="/rhl-logo.svg"
          alt="Random Humans Lab Logo"
          width={100}
          height={100}
        />
      </Link>
      <h1 className="text-6xl text-black mt-2">Sorry about that</h1>
      <h1 className="text-xl text-black mt-2">This page could not be found</h1>
    </div>
  );
};

export default Custom404;
