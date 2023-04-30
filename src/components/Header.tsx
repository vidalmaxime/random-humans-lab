import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function Header({ title }: HeaderProps) {
  return (
    <div className="flex w-full">
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <Link href="/">
          <Image
            src="/rhl-logo.svg"
            alt="Random Humans Lab Logo"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <h1 className="text-black text-2xl md:text-5xl  ml-8 w-2/3">{title}</h1>
    </div>
  );
}

type HeaderProps = {
  title: string;
};
